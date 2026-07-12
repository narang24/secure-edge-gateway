const bcrypt = require("bcrypt");
const pool = require("../config/db");
const jwt = require("jsonwebtoken");

const register = async ({ name, email, password }) => {

    const existingUser = await pool.query(
        "SELECT * FROM users WHERE email = $1",
        [email]
    );

    if (existingUser.rows.length > 0) {
        throw new Error("Email already exists");
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const result = await pool.query(
        `
        INSERT INTO users(name,email,password)
        VALUES($1,$2,$3)
        RETURNING id,name,email;
        `,
        [name, email, hashedPassword]
    );

    return result.rows[0];
};

const login = async ({ email, password }) => {
    const result = await pool.query(
        "SELECT * FROM users WHERE email = $1",
        [email]
    );

    if (result.rows.length === 0) {
        throw {
            status: 401,
            message: "Invalid email or password"
        };
    }

    const user = result.rows[0];

    const validPassword = await bcrypt.compare(password, user.password);

    if (!validPassword) {
        throw {
            status: 401,
            message: "Invalid email or password"
        };
    }

    const token = jwt.sign(
        {
            id: user.id,
            email: user.email
        },
        process.env.JWT_SECRET,
        {
            expiresIn: "1h"
        }
    );

    return {
        message: "Login successful",
        token,
        user: {
            id: user.id,
            name: user.name,
            email: user.email
        }
    };
};

const getProfile = async (userId) => {
    const result = await pool.query(
        `SELECT id, name, email
         FROM users
         WHERE id = $1`,
        [userId]
    );

    if (result.rows.length === 0) {
        throw new Error("User not found");
    }

    return result.rows[0];
};

module.exports = {
    register,
    login,
    getProfile
};