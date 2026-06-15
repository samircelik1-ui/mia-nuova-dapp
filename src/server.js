import express from "express";
import sqlite3 from "sqlite3";
import cors from "cors";

const sqlite = sqlite3.verbose();

const app = express();

app.use(cors());
app.use(express.json());

const db = new sqlite.Database("./users.db");

db.run(`
CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  username TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
)
`);

app.post("/users", (req, res) => {
  const { username } = req.body;

  db.run(
    "INSERT INTO users(username) VALUES(?)",
    [username],
    function (err) {
      if (err) {
        return res.status(500).json({ error: err.message });
      }

      res.json({
        success: true,
        id: this.lastID,
      });
    }
  );
});

app.get("/users", (req, res) => {
  db.all(
    "SELECT * FROM users ORDER BY id DESC",
    [],
    (err, rows) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }

      res.json(rows);
    }
  );
});

app.listen(3001, () => {
  console.log("Server running on port 3001");
});