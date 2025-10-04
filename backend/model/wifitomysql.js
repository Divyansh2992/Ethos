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

async function importWifiCsvToMySQL(csvFilePath) {
  const quoteId = (identifier) => `\`${String(identifier).replaceAll('`', '``')}\``;

  const { database: desiredDatabase, ...baseConfig } = dbConfig;
  const connection = await mysql.createConnection(baseConfig);
  try {
    if (desiredDatabase) {
      await connection.query(`CREATE DATABASE IF NOT EXISTS ${quoteId(desiredDatabase)}`);
      await connection.changeUser({ database: desiredDatabase });
    }

    // Read CSV to get headers and rows
    const { rows, columns } = await new Promise((resolve, reject) => {
      const collected = [];
      let headersCols = null;
      fs.createReadStream(csvFilePath)
        .pipe(csv())
        .on('headers', (headers) => {
          headersCols = headers;
        })
        .on('data', (data) => collected.push(data))
        .on('end', () => resolve({ rows: collected, columns: headersCols }))
        .on('error', reject);
    });

    if (!columns || columns.length === 0) {
      throw new Error('Unable to determine CSV columns; ensure the CSV has headers.');
    }

    // Create table `wifi` if not exists (all VARCHAR(255) to keep it simple/general)
    const createTableQuery = `
      CREATE TABLE IF NOT EXISTS ${quoteId('wifi')} (
        ${columns.map((col) => `${quoteId(col)} VARCHAR(255)`).join(', ')}
      )
    `;
    await connection.query(createTableQuery);

    // Insert rows
    await connection.beginTransaction();
    const placeholders = columns.map(() => '?').join(', ');
    const columnList = columns.map(quoteId).join(', ');
    const insertSql = `INSERT INTO ${quoteId('wifi')} (${columnList}) VALUES (${placeholders})`;
    for (const row of rows) {
      const values = columns.map((col) => row[col] ?? null);
      await connection.execute(insertSql, values);
    }
    await connection.commit();

    console.log(`Imported ${rows.length} rows into wifi`);
  } catch (error) {
    try { await connection.rollback(); } catch (_) {}
    console.error('Failed to import WiFi CSV:', error.message);
    throw error;
  } finally {
    await connection.end();
  }
}

// Run if executed directly
if (require.main === module) {
  const csvPath = path.join(__dirname, '..', 'data', 'wifi_associations_logs.csv');
  importWifiCsvToMySQL(csvPath).catch(() => process.exit(1));
}

module.exports = { importWifiCsvToMySQL };


