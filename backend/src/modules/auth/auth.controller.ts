import { Request, Response } from "express";
import { registerUser, loginUser } from "./auth.service";
import jwt from "jsonwebtoken";

export const register = async (req: Request, res: Response) => {
  try {
    const { firstName, lastName, email, password } = req.body;

    const user = await registerUser(firstName, lastName, email, password);

    res.status(201).json({
      message: "User registered successfully",
      user
    });

  } catch (error: any) {
    res.status(400).json({
      message: error.message
    });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const data = await loginUser(email, password);

    res.status(200).json({
      message: "Login successful",
      ...data
    });

  } catch (error: any) {
    res.status(401).json({
      message: error.message
    });
  }
};

export const refreshToken = async (req: Request, res: Response) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(401).json({
        message: "Refresh token missing"
      });
    }

    const decoded = jwt.verify(
      refreshToken,
      process.env.JWT_REFRESH_SECRET as string
    ) as { userId: string };

    const accessToken = jwt.sign(
      { userId: decoded.userId },
      process.env.JWT_ACCESS_SECRET as string,
      { expiresIn: "15m" }
    );

    res.status(200).json({
      accessToken
    });

  } catch (error) {
    res.status(401).json({
      message: "Invalid refresh token"
    });
  }
};