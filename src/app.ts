import express, { Express, Request, Response } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import helmet from "helmet";
// import auth from './routes/auth'
import { router as userRouter } from './routes/auth';
import { connectRedis } from './utils/redis';
import { errorHandler } from './middleware/errorHandler';
import { limiter } from './utils/rate-limiter';

const corsOption = {
  origin: process.env.CLIENT_URL,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

const app: Express = express();

// Initialize Redis connection
connectRedis().catch(err => {
  console.error('Failed to connect to Redis:', err);
});

app.use(cors(corsOption));
app.use(helmet());
app.use(express.json());
app.use(cookieParser());
app.use(errorHandler);

app.get("/",(req:Request,res:Response)=>{
    res.send("Hello Server Running");
})
app.use('/api', limiter, userRouter);

export default app;
