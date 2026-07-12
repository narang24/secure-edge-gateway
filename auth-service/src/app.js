const express = require("express");

const app = express();

const authRoutes = require("./routes/auth.routes");

app.use(express.json());

app.use("/auth", authRoutes);

app.get("/health", (req, res) => {
    res.json({
        service: "Auth Service",
        status: "Healthy"
    });
});

module.exports = app;