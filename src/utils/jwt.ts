import jwt from 'jsonwebtoken';
import { client } from './redis';
import { logger } from './logger';

const JWT_REFRESH = process.env.JWT_REFRESH as string;
const JWT_SECRET = process.env.JWT_SECRET as string;

export const generateAccessToken = (id: string) => 
  jwt.sign({ id }, JWT_SECRET, { expiresIn: '15m' });

export const generateRefreshToken = (id: string) => 
  jwt.sign({ id }, JWT_REFRESH, { expiresIn: '1d' });

export const verifyAccessToken = (token: string) => {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    logger.error('Error verifying access token:', error);
    throw error;
  }
};

export const verifyRefreshToken = async (token: string) => {
  try {
    // Check if token is blacklisted
    const isBlacklisted = await client.get(`bl_${token}`);
    if (isBlacklisted) {
      throw new Error('Token has been revoked');
    }
    return jwt.verify(token, JWT_REFRESH);
  } catch (error) {
    logger.error('Error verifying refresh token:', error);
    throw error;
  }
};

export const blacklistToken = async (token: string, expiresIn: number) => {
  try {
    await client.set(`bl_${token}`, '1', 'EX', expiresIn);
  } catch (error) {
    logger.error('Error blacklisting token:', error);
    throw error;
  }
};
