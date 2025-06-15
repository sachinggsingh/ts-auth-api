import Redis from "ioredis"
import { logger } from "./logger";
import dotenv from "dotenv";
dotenv.config();

if (!process.env.REDIS_URL) {
    throw new Error('REDIS_URL is not defined in environment variables');
}

export const client = new Redis(process.env.REDIS_URL, {
    retryStrategy: (times) => {
        const delay = Math.min(times * 50, 2000);
        return delay;
    },
    maxRetriesPerRequest: 3,
    enableReadyCheck: true,
    reconnectOnError: (err) => {
        const targetError = 'READONLY';
        if (err.message.includes(targetError)) {
            return true;
        }
        return false;
    }
});

// Handle Redis connection events
client.on('connect', () => {
    logger.info('Redis client connected');
});

client.on('error', (err) => {
    logger.error('Redis client error:', err);
});

client.on('ready', () => {
    logger.info('Redis client ready');
});

client.on('reconnecting', () => {
    logger.info('Redis client reconnecting');
});

export async function connectRedis() {
    try {
        // Test the connection
        await client.set("test", "Redis is connected");
        const value = await client.get("test");
        if (value) {
            logger.info(`Redis test key value: ${value}`);
        } else {
            logger.warn("Redis test key not found");
        }
        logger.info("Redis connection test successful");
    } catch (err) {
        logger.error("Redis connection test failed:", err);
        throw err;
    }
}
