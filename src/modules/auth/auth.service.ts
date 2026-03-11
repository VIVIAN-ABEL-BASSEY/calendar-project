import {User} from "../user/user.model";
import { hashPassword, comparePassword } from "../../utils/hash";
import { generateAccessToken, generateRefreshToken } from "../../config/jwt";

export const registerUser = async (
  firstName: string,
  lastName: string,
  email: string,
  passwordHash: string
) => {
  const existingUser = await User.findOne({ email });

  if (existingUser) {
    throw new Error("User already exists");
  }

  const hashedPassword = await hashPassword(passwordHash);

  const user = await User.create({
  firstName,
  lastName,
  email,
  passwordHash: hashedPassword,
});

  return user;
};

export const loginUser = async (email: string, passwordHash: string) => {
  const user = await User.findOne({ email }).select("+password");

  if (!user) {
    throw new Error("Invalid credentials");
  }

  const isMatch = await comparePassword(passwordHash, user.passwordHash);

  if (!isMatch) {
    throw new Error("Invalid credentials");
  }

  const accessToken = generateAccessToken(user._id.toString());
  const refreshToken = generateRefreshToken(user._id.toString());

  return {
    user,
    accessToken,
    refreshToken,
  };
};