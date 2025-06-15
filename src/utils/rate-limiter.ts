import rateLimit from 'express-rate-limit';

export const limiter = rateLimit({
    windowMs: 60 * 60 * 1000,
    max: 1,
    message: "Too many login attempts, please try again after an hour",
    standardHeaders: true,
    legacyHeaders: false,
})