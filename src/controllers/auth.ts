import { Response, Request } from "express";
import { pool } from "../db/db";
import dotenv from "dotenv";
import { hashSync, compareSync } from "bcrypt";
import jwt from "jsonwebtoken";
import { generateAccessToken, generateRefreshToken, verifyRefreshToken, blacklistToken } from "../utils/jwt";
import { logger } from "../utils/logger";
import { sendLoginNotification } from "../utils/nodemailer";

dotenv.config();

const setRefreshTokenCookie = (res: Response, token: string) => {
  res.cookie('refreshToken', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge:  24 * 60 * 60 * 1000 // 1 day
  });
};

export const register = async (req: Request, res: Response): Promise<void> => {
  const { email, password } = req.body;

  try {
    const hashedPassword = hashSync(password, 10);
    const existingUser = await pool.query("SELECT * FROM users WHERE email = $1", [email]);

    if (existingUser.rows.length > 0) {
      logger.warn(`User with email ${email} already exists`);
      res.status(409).json({ message: "User already exists", success: false });
      return;
    }

    const insertedUser = await pool.query(
      "INSERT INTO users (email, password) VALUES ($1, $2) RETURNING id",
      [email, hashedPassword]
    );

    const userId = insertedUser.rows[0].id;
    const accessToken = generateAccessToken(userId);
    const refreshToken = generateRefreshToken(userId);

    setRefreshTokenCookie(res, refreshToken);

    logger.info(`User with email ${email} registered successfully`);
    res.status(201).json({
      message: "User created",
      success: true,
      accessToken
    });
  } catch (error) {
    logger.error("Error during user registration", error);
    res.status(500).json({ message: "Something went wrong", success: false });
  }
};

export const login = async (req: Request, res: Response): Promise<void> => {
  const { email, password } = req.body;

  if (!email || !password) {
    logger.warn("Email and password are required for login");
    res.status(400).json({ message: "Email and password are required", success: false });
    return;
  }

  try {
    const user = await pool.query("SELECT * FROM users WHERE email = $1", [email]);

    if (user.rows.length === 0) {
      logger.warn(`No user found with email ${email}`);
      res.status(404).json({ message: "No user exists", success: false });
      return;
    }

    const validUser = compareSync(password, user.rows[0].password);

    if (!validUser) {
      logger.warn(`Invalid credentials for user with email ${email}`);
      res.status(401).json({ message: "Invalid credentials", success: false });
      return;
    }

    const userId = user.rows[0].id;
    const accessToken = generateAccessToken(userId);
    const refreshToken = generateRefreshToken(userId);

    setRefreshTokenCookie(res, refreshToken);
    sendLoginNotification(email);

    logger.info(`User with email ${email} logged in successfully`);
    res.status(200).json({
      message: "Login successful",
      accessToken,
      success: true
    });
  } catch (error) {
    logger.error("Error during login", error);
    res.status(500).json({ message: "Internal server error", success: false });
  }
};

export const refresh = async (req: Request, res: Response): Promise<void> => {
  const refreshToken = req.cookies.refreshToken;

  if (!refreshToken) {
    logger.warn("No refresh token provided");
    res.status(401).json({ message: "Refresh token is required", success: false });
    return;
  }

  try {
    const decoded = await verifyRefreshToken(refreshToken) as jwt.JwtPayload;
    const accessToken = generateAccessToken(decoded.id);
    
    res.status(200).json({ 
      accessToken,
      success: true 
    });
  } catch (error) {
    logger.error("Invalid refresh token", error);
    res.status(403).json({ 
      message: "Invalid refresh token", 
      success: false 
    });
  }
};

export const logout = async (req: Request, res: Response): Promise<void> => {
  const refreshToken = req.cookies.refreshToken;

  try {
    if (refreshToken) {
      const decoded = jwt.decode(refreshToken) as jwt.JwtPayload;
      if (decoded && decoded.exp) {
        const expiresIn = decoded.exp - Math.floor(Date.now() / 1000);
        await blacklistToken(refreshToken, expiresIn);
      }
    }

    res.clearCookie('refreshToken', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict'
    });

    res.status(200).json({ 
      message: "Logged out successfully",
      success: true 
    });
  } catch (error) {
    logger.error("Error during logout", error);
    res.status(500).json({ 
      message: "Internal server error",
      success: false 
    });
  }
};
