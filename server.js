const express = require('express');
const bodyParser = require('body-parser');
const sql = require('mysql2/promise');
require('dotenv').config();
const app = express();
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());
const pool = sql.createPool({
    host: process.env.HOST,
    user: process.env.USER,
    password: process.env.PASSWORD,
    database: process.env.DB
});
async function createDB() {
    try {
        let connection = await sql.createConnection({
            host: process.env.HOST,
            user: process.env.USER
        });
        await connection.query(`CREATE DATABASE IF NOT EXISTS ${process.env.DB}`);
        connection.end();
    } catch (error) {
        console.error('Creating Database Error:', error);
    } 
}



app.post('/entity', async (req, res) => {
    const { emp_name, mobile, email, salary, city, country, department, role } = req.body;
    try {
        await createDB();
        const connection = await pool.getConnection();
        await connection.execute(`CREATE TABLE IF NOT EXISTS employees (
            emp_id INT AUTO_INCREMENT PRIMARY KEY NOT NULL,
            emp_name VARCHAR(50) NOT NULL,
            mobile VARCHAR(10) UNIQUE NOT NULL,
            email VARCHAR(50) UNIQUE,
            salary DECIMAL(10, 2),
            city VARCHAR(50),
            country VARCHAR(50),
            department VARCHAR(50) NOT NULL,
            role VARCHAR(50) NOT NULL
        )`);
        const values = [emp_name, mobile, email, salary, city, country, department, role].map(value => value !== undefined ? value : null);
        const [result] = await connection.execute('INSERT INTO employees (emp_name, mobile, email, salary, city, country, department, role) VALUES (?, ?, ?, ?, ?, ?, ?, ?)', values);
        connection.release();
        res.json({ id: result.insertId });
    } catch (error) {
        console.error('Error executing SQL:', error);
        res.status(500).json({ error: error.message });
    }
});
app.get('/entity/:id', async (req, res) => {
    const entity_id = req.params.id;
    try {
        const connection = await pool.getConnection();
        const [rows] = await connection.execute('SELECT * FROM employees WHERE emp_id = ?', [entity_id]);
        connection.release();
        if (rows.length === 0) {
            res.status(404).json({ error: 'No Record found.' });
        } else {
            res.json(rows[0]);
        }
    } catch (error) {
        console.error('Error executing SQL:', error);
        res.status(500).json({ error: error.message });
    }
});
app.put('/entity/:id', async (req, res) => {
    const entity_id = req.params.id;
    const { ...data } = req.body;
    try {
        const connection = await pool.getConnection();
        var query = 'UPDATE employees SET '
        const values = [];
        const keys = Object.keys(data);
        if (keys.length >0){
            for (let i = 0; i < keys.length; i++) {
                const column = keys[i]
                if (i == keys.length - 1){
                    query+=`${column} = ? WHERE emp_id = ?`;
                    values.push(data[column])
                    values.push(entity_id);
                    break;
                    
                }
                query += `${column} = ?, `;
                values.push(data[column]);

            }
        }
        else{
            res.status(500).json({error:"No Columns found"});
            res.end();
        }
        const [result] = await connection.execute(query,values);
        connection.release();
        if (result.affectedRows ==1){
            res.json({ message: "Record Updated" });
        }
        else{
            res.status(500).json({message:"Record Not Found"});
        }
    } catch (error) {
        console.error('Error executing SQL:', error);
        res.status(500).json({ error: error.message });
    }
});
app.delete('/entity/:id', async (req, res) => {
    const entity_id = req.params.id;
    try {
        const connection = await pool.getConnection();
        const [result] = await connection.execute('DELETE FROM employees WHERE emp_id = ?', [entity_id]);
        connection.release();
        if (result.affectedRows ==1){
            res.json({ message: "Record Deleted" });
        }
        else{
            res.status(500).json({message:"Record Not Found"});
        }
    } catch (error) {
        console.error('Error executing SQL:', error);
        res.status(500).json({ error: error.message });
    }
});
const PORT = process.env.PORT;
app.listen(PORT, () => {
    console.log(`On port ${PORT}`);
});