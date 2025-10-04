const fs = require('fs');
const path = require('path');
const mysql = require('mysql2/promise');
const csv = require('csv-parser');

const dbConfig = {
  host: '127.0.0.1',
  user: 'root',
  password: '123456',
  database: 'ethos'
};

async function importCSVtoMySQL(csvFilePath, tableName, columns = [], options = {}) {
  const quoteId = (identifier) => `\`${String(identifier).replaceAll('`', '``')}\``;

  // Connect without selecting a default database first
  const { database: desiredDatabase, ...baseConfig } = dbConfig;
  const connection = await mysql.createConnection(baseConfig);
  try {
    // Ensure target database exists, then switch to it
    if (desiredDatabase) {
      await connection.query(`CREATE DATABASE IF NOT EXISTS ${quoteId(desiredDatabase)}`);
      // changeUser selects the database for the current connection
      await connection.changeUser({ database: desiredDatabase });
    }

    // Read CSV once to collect rows and (optionally) infer columns from headers
    const rows = await new Promise((resolve, reject) => {
      const collected = [];
      let inferredColumns = null;
      const stream = fs
        .createReadStream(csvFilePath)
        .pipe(csv())
        .on('headers', (headers) => {
          if (!columns || columns.length === 0) {
            inferredColumns = headers;
          }
        })
        .on('data', (data) => collected.push(data))
        .on('end', () => {
          if ((!columns || columns.length === 0) && inferredColumns) {
            columns = inferredColumns;
          }
          resolve(collected);
        })
        .on('error', reject);
    });

    if (!columns || columns.length === 0) {
      throw new Error('Unable to determine CSV columns; provide columns explicitly or ensure the CSV has headers.');
    }

    // Optionally drop the table (used when replacing datasets)
    if (options && options.dropTable) {
      await connection.query(`DROP TABLE IF EXISTS ${quoteId(tableName)}`);
    }

    // Create table if not exists
    const createTableQuery = `
      CREATE TABLE IF NOT EXISTS ${quoteId(tableName)} (
        ${columns.map((col) => `${quoteId(col)} VARCHAR(255)`).join(', ')}
      )
    `;
    await connection.query(createTableQuery);

    // Insert data in a transaction
    await connection.beginTransaction();
    const placeholders = columns.map(() => '?').join(', ');
    const columnList = columns.map(quoteId).join(', ');
    const insertSql = `INSERT INTO ${quoteId(tableName)} (${columnList}) VALUES (${placeholders})`;

    for (const row of rows) {
      const values = columns.map((col) => row[col] ?? null);
      await connection.execute(insertSql, values);
    }
    await connection.commit();

    console.log(`Imported ${rows.length} rows into ${tableName}`);
  } catch (error) {
    try { await connection.rollback(); } catch (_) {}
    console.error(`Failed to import CSV to MySQL for table ${tableName}:`, error.message);
    throw error;
  } finally {
    await connection.end();
  }
}

// For profile.csv -> table: profile
// Provide explicit columns that match the new `profile.csv` layout.
const profileColumns = [
  'entity_id', 'name', 'role', 'email', 'department',
  'card_id', 'device_hash', 'face_id', 'person_id'
];
// Replace the existing `profile` table so schema matches the new CSV.
async function importProfileCsv() {
  try {
    await importCSVtoMySQL(
      path.join(__dirname, '..', 'data', 'profile.csv'),
      'profile',
      profileColumns,
      { dropTable: true }
    );
  } catch (err) {
    console.error('Failed to import profile.csv:', err.message);
  }
}

// Start profile import
importProfileCsv();

// For data_seq.csv -> table: data
// If columns are omitted or empty, they will be inferred from the CSV headers
const dataSeqColumns = []; // leave empty to infer from headers
// We want to replace the existing `data` table when switching datasets.
// Pass an options object with dropTable=true to drop and recreate the table.
async function importDataSeq() {
  try {
    await importCSVtoMySQL(
      path.join(__dirname, '..', 'data', 'data_seq.csv'),
      'data',
      dataSeqColumns,
      { dropTable: true }
    );
  } catch (err) {
    console.error('Failed to import data_seq.csv:', err.message);
  }
}

// Start import
importDataSeq();
