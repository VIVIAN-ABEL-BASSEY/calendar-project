"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.login = exports.register = void 0;
const auth_service_1 = require("./auth.service");
const register = async (req, res) => {
    try {
        const { firstName, lastName, email, password } = req.body;
        const user = await (0, auth_service_1.registerUser)(firstName, lastName, email, password);
        res.status(201).json({
            message: "User registered successfully",
            user
        });
    }
    catch (error) {
        res.status(400).json({
            message: error.message
        });
    }
};
exports.register = register;
const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const data = await (0, auth_service_1.loginUser)(email, password);
        res.status(200).json({
            message: "Login successful",
            ...data
        });
    }
    catch (error) {
        res.status(401).json({
            message: error.message
        });
    }
};
exports.login = login;
