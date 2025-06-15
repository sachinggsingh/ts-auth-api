import winston from 'winston';

export const logger = winston.createLogger({
       level: process.env.NODE_ENV === "production" ? "info" : "debug",
        format: winston.format.combine(
    winston.format.errors({ stack: true }),
    winston.format.timestamp(),
    winston.format.splat(),
    winston.format.json()
  ),
  defaultMeta: { service: "auth-service" },
  transports: [
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple()
      ),
    }),
  ],
});