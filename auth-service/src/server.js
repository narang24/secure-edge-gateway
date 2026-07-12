const app = require("./app");
const dotenv = require("dotenv");
const pool = require("./config/db");
const initDB = require("./config/initDB");

(async () => {
    await initDB();
})();

(async () => {
    try {
        const result = await pool.query("SELECT NOW()");
        console.log(result.rows[0]);
    } catch (err) {
        console.error(err);
    }
})();

const envFile =
    process.env.NODE_ENV === "production"
        ? ".env.production"
        : ".env.development";

dotenv.config({ path: envFile });

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Auth Service running on port ${PORT}`);
});