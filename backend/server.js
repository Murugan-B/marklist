const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();
app.use(cors());
app.use(bodyParser.json());


const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "murugan1102",
    database: "marklist_db"
});

db.connect(err => {
    if (err) {
        console.error("Database connection failed: " + err.stack);
        return;
    }
    console.log("Connected to MySQL database");
});


app.get("/marks", (req, res) => {
    db.query("SELECT * FROM marks", (err, results) => {
        if (err) throw err;
        res.json(results);
    });
});

app.post("/marks", (req, res) => {
    const { student_name, subject, marks } = req.body;
    const sql = "INSERT INTO marks (student_name, subject, marks) VALUES (?, ?, ?)";
    db.query(sql, [student_name, subject, marks], (err, result) => {
        if (err) throw err;
        res.json({ id: result.insertId, student_name, subject, marks });
    });
});


app.put("/marks/:id", (req, res) => {
    const { student_name, subject, marks } = req.body;
    const { id } = req.params;
    const sql = "UPDATE marks SET student_name = ?, subject = ?, marks = ? WHERE id = ?";
    db.query(sql, [student_name, subject, marks, id], (err, result) => {
        if (err) throw err;
        res.json({ message: "Mark updated successfully!" });
    });
});


app.delete("/marks/:id", (req, res) => {
    const { id } = req.params;
    const sql = "DELETE FROM marks WHERE id = ?";
    db.query(sql, [id], (err, result) => {
        if (err) throw err;
        res.json({ message: "Mark deleted successfully!" });
    });
});

const PORT = 8000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
