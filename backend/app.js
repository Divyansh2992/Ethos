const express=require('express');
const app=express();
const cors=require('cors');
const mysql=require('mysql2/promise');
const path=require('path');
const fs=require('fs');
const env = require("dotenv");

env.config();

const dbConfig = {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE
};

const pool=mysql.createPool(dbConfig);

app.use(cors({ origin: 'http://localhost:5173' }));

app.get('/mysql/profile',async(req,res)=>{
	try{
		const [rows]=await pool.query('SELECT * FROM `profile`');
		res.json(rows);
	}catch(err){
		res.status(500).json({error:'Failed to fetch profiles'});
	}
});

app.get('/mysql/data',async(req,res)=>{
	try{
		const [rows]=await pool.query('SELECT * FROM `data`');
		res.json(rows);
	}catch(err){
		res.status(500).json({error:'Failed to fetch data'});
	}
});

app.get('/mysql/profile/unique-entities/count',async(req,res)=>{
	try{
		// Count unique person identifiers instead of entity_id
		const [rows]=await pool.query('SELECT COUNT(DISTINCT `person_id`) AS cnt FROM `profile`');
		const count=(rows && rows[0] && rows[0].cnt)||0;
		res.json({count});
	}catch(err){
		res.status(500).json({error:'Failed to calculate unique entity count'});
	}
});


app.get('/mysql/wifi/unique-device-hashes/count',async(req,res)=>{
	try{
		const [rows]=await pool.query('SELECT COUNT(DISTINCT `device_hash`) AS cnt FROM `wifi` WHERE `device_hash` IS NOT NULL AND `device_hash` <> ""');
		const count=(rows && rows[0] && rows[0].cnt)||0;
		res.json({count});
	}catch(err){
		res.status(500).json({error:'Failed to count unique device hashes'});
	}
});

// Unified search by name, IDs, email, card number, or device hash
// Usage: GET /search?q=<term>
app.get('/search',async(req,res)=>{
	const q=(req.query && req.query.q ? String(req.query.q).trim() : '');
	if(!q){
		return res.status(400).json({error:'Missing query parameter `q`'});
	}
	try{
		const like=`%${q}%`;
		// Search by person_id or device_hash exact match, or partial match on name/email
		const [profiles]=await pool.query(
			'SELECT * FROM `profile` WHERE `person_id` = ? OR `device_hash` = ? OR `name` LIKE ? OR `email` = ? OR `email` LIKE ?',
			[q,q,like,q,like]
		);
		return res.json({profiles});
	}catch(err){
		return res.status(500).json({error:'Search failed'});
	}
});

// Serve face image by face_id. Tries <face_id>.jpg / .jpeg (case-insensitive)
app.get('/face/:faceId',async(req,res)=>{
	const faceId=String(req.params.faceId||'').trim();
	if(!faceId){
		return res.status(400).json({error:'Missing faceId'});
	}
	const baseDir=path.join(__dirname,'data','face_images');
	// candidates to check
	const candidates=[
		`${faceId}.jpg`, `${faceId}.jpeg`,
		`${faceId.toLowerCase()}.jpg`, `${faceId.toLowerCase()}.jpeg`,
		`${faceId.toUpperCase()}.jpg`, `${faceId.toUpperCase()}.jpeg`
	];
	for(const rel of candidates){
		const abs=path.join(baseDir, rel);
		if(fs.existsSync(abs)){
			return res.sendFile(abs);
		}
	}
	return res.status(404).json({error:'Face image not found'});
});

// Route to get top 3 most visited locations (room_id) from data table
app.get('/mysql/data/top-locations', async (req, res) => {
  try {
    const [rows] = await pool.query(
      'SELECT room_id, COUNT(*) AS visits FROM `data` GROUP BY room_id ORDER BY visits DESC LIMIT 3'
    );
    res.json({ top_locations: rows });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch top locations' });
  }
});

// Return top 5 unique person_id values by ordering data rows by entity_id ASC then timestamp ASC
app.get('/mysql/data/top-persons', async (req, res) => {
	try {
		// Parse timestamps for ordering (covers common formats)
		const parsedTs = `COALESCE(
			STR_TO_DATE(timestamp, '%Y-%m-%d %H:%i:%s'),
			STR_TO_DATE(timestamp, '%Y-%m-%d %H:%i'),
			STR_TO_DATE(timestamp, '%d-%m-%Y %H:%i:%s'),
			STR_TO_DATE(timestamp, '%d-%m-%Y %H:%i')
		)`;

		// Fetch person_id+entity_id from data ordered the same way as:
		// SELECT * FROM data ORDER BY entity_id ASC, timestamp ASC;
		const sql = `SELECT person_id, entity_id, timestamp FROM \`data\` ORDER BY entity_id ASC, ${parsedTs} ASC`;
		const [rows] = await pool.query(sql);

		// Deduplicate person_id preserving first-seen order from the ordered rows
		const seen = new Set();
		const results = [];
		for (const row of rows) {
			const pid = row.person_id;
			const ts = row.timestamp;
			if (pid && pid !== '' && !seen.has(pid)) {
				seen.add(pid);
				results.push({ person_id: pid, first_seen: ts });
				if (results.length >= 5) break;
			}
		}
		res.json({ top_persons: results });
	} catch (err) {
		console.error('top-persons error', err && err.message ? err.message : err);
		res.status(500).json({ error: 'Failed to fetch top persons' });
	}
});

// Activity timeline for a person: GET /mysql/activity-timeline?person_id=...&start=YYYY-MM-DD HH:MM:SS&end=...
app.get('/mysql/activity-timeline', async (req, res) => {
	const personId = req.query && req.query.person_id ? String(req.query.person_id).trim() : '';
	const start = req.query && req.query.start ? String(req.query.start).trim() : null;
	const end = req.query && req.query.end ? String(req.query.end).trim() : null;
	if (!personId) {
		return res.status(400).json({ error: 'Missing required query parameter `person_id`' });
	}
	try {
		let sql = 'SELECT entity_id, person_id, room_id, timestamp, hour, day, weekday, next_room FROM `data` WHERE person_id = ?';
		const params = [personId];
		if (start) {
			sql += ' AND timestamp >= ?';
			params.push(start);
		}
		if (end) {
			sql += ' AND timestamp <= ?';
			params.push(end);
		}
		sql += ' ORDER BY timestamp DESC';
		const [rows] = await pool.query(sql, params);
		return res.json({ person_id: personId, timeline: rows });
	} catch (err) {
		return res.status(500).json({ error: 'Failed to fetch activity timeline' });
	}
});


app.listen(3000,()=>{
    console.log('Server is running on port 3000');
});
