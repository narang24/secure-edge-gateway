const authService = require("../services/auth.service");

const register = async (req, res) => {
    try {
        const user = await authService.register(req.body);

        res.status(201).json(user);
    } catch (err) {
        res.status(400).json({
            error: err.message
        });
    }
};

const login = async (req, res) => {
    try {
        const user = await authService.login(req.body);

        res.status(200).json(user);
    } catch (err) {
        res.status(400).json({
            error: err.message
        });
    }
};

const profile = async (req, res) => {
    try {
        const user = await authService.getProfile(req.user.id);

        res.status(200).json(user);
    } catch (err) {
        res.status(500).json({
            message: err.message,
        });
    }
};

module.exports = {
    register,
    login,
    profile
};