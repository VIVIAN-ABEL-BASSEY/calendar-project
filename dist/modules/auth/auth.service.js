"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginUser = exports.registerUser = void 0;
const user_model_1 = require("../user/user.model");
const hash_1 = require("../../utils/hash");
const jwt_1 = require("../../config/jwt");
const registerUser = async (firstName, lastName, email, passwordHash) => {
    const existingUser = await user_model_1.User.findOne({ email });
    if (existingUser) {
        throw new Error("User already exists");
    }
    const hashedPassword = await (0, hash_1.hashPassword)(passwordHash);
    const user = await user_model_1.User.create({
        firstName,
        lastName,
        email,
        passwordHash: hashedPassword,
    });
    return user;
};
exports.registerUser = registerUser;
const loginUser = async (email, passwordHash) => {
    const user = await user_model_1.User.findOne({ email }).select("+password");
    if (!user) {
        throw new Error("Invalid credentials");
    }
    const isMatch = await (0, hash_1.comparePassword)(passwordHash, user.passwordHash);
    if (!isMatch) {
        throw new Error("Invalid credentials");
    }
    const accessToken = (0, jwt_1.generateAccessToken)(user._id.toString());
    const refreshToken = (0, jwt_1.generateRefreshToken)(user._id.toString());
    return {
        user,
        accessToken,
        refreshToken,
    };
};
exports.loginUser = loginUser;
