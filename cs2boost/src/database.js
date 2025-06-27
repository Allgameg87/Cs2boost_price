const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./keys.db');

const initDatabase = () => {
  db.run(`CREATE TABLE IF NOT EXISTS keys (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    key_value TEXT NOT NULL UNIQUE,
    product TEXT NOT NULL,
    used BOOLEAN DEFAULT 0
  )`);
};

const addKey = (keyValue, product, callback) => {
  db.run(`INSERT INTO keys (key_value, product, used) VALUES (?, ?, 0)`, [keyValue, product], callback);
};

const getRandomUnusedKey = (product, callback) => {
  db.get(`SELECT key_value FROM keys WHERE product = ? AND used = 0 ORDER BY RANDOM() LIMIT 1`, [product], (err, row) => {
    if (err || !row) {
      callback(err, null);
      return;
    }
    db.run(`UPDATE keys SET used = 1 WHERE key_value = ?`, [row.key_value], (updateErr) => {
      callback(updateErr, row.key_value);
    });
  });
};

module.exports = { initDatabase, addKey, getRandomUnusedKey };