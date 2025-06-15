import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

// Extend Express Request interface to include 'user'
declare global {
  namespace Express {
    interface Request {
      user?: { id: string };
    }
  }
}   

const JWT_REFRESH = process.env.JWT_REFRESH as string;
const JWT_SECRET = process.env.JWT_SECRET as string;

export const auth = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith('Bearer ')) return res.sendStatus(401);

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as jwt.JwtPayload;
    req.user = { id: decoded.id };
    next();
  } catch {
    res.status(401).json({ message: 'Invalid or expired token' });
  }
};
