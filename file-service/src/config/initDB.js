const pool = require("./db");

const initDB = async () => {
    try {
        await pool.query(`
            CREATE TABLE IF NOT EXISTS files (
                id SERIAL PRIMARY KEY,
                filename VARCHAR(255) NOT NULL,
                s3_key TEXT NOT NULL,
                content_type VARCHAR(100),
                size INTEGER,
                owner_id INTEGER,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `);

        console.log("Files table ready");
    } catch (err) {
        console.error("Error creating files table:", err.message);
    }
};

module.exports = initDB;