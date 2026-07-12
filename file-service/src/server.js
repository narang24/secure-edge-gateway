const app = require("./app");
const dotenv = require("dotenv");
const initDB = require("./config/initDB");

const envFile =
    process.env.NODE_ENV === "production"
        ? ".env.production"
        : ".env.development";

dotenv.config({ path: envFile });

const PORT = process.env.PORT || 5001;

initDB();

app.listen(PORT, () => {
    console.log(process.env.DB_HOST);
    console.log(`File Service running on port ${PORT}`);
});