const bcrypt = require('bcrypt');
const mysql = require('mysql');
require('dotenv').config();
 
const connection = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});

connection.connect(err => {
    if (err) {
        console.error('Error connecting to MySQL database:', err);
        process.exit(1);
    }
    console.log('Connected to MySQL database');
});
 
const hashPasswords = async () => {
    try { 
        const query = 'SELECT id, password FROM employees';

        connection.query(query, async (err, results) => {
            if (err) {
                console.error('Error querying database:', err);
                return;
            }
 
            for (let i = 0; i < results.length; i++) {
                const id = results[i].id;
                const plainPassword = results[i].password;
 
                const saltRounds = 10;
                const hashedPassword = await bcrypt.hash(plainPassword, saltRounds);
 
                const updateQuery = 'UPDATE employees SET password = ? WHERE id = ?';
                connection.query(updateQuery, [hashedPassword, id], (updateErr, updateResult) => {
                    if (updateErr) {
                        console.error(`Error updating password for employee ${id}:`, updateErr);
                    } else {
                        console.log(`Password updated for employee ${id}`);
                    }
                });
            }
 
            connection.end();
        });

    } catch (error) {
        console.error('Error hashing passwords:', error);
    }
};
 
hashPasswords();
