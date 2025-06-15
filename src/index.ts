import app from './app';
import dotenv from 'dotenv';
dotenv.config();
import { logger } from './utils/logger';

const PORT = process.env.PORT || 5000;

app.use((req, res, next) => {
  logger.warn("something is wrong")
  logger.info("Request received");
  logger.debug("Request details", { method: req.method, url: req.url, headers: req.headers });
  logger.info(`${req.method} ${req.url}`);
  next();
});

app.listen(PORT, () => {
  logger.info(`Server running on http://localhost:${PORT}`);
});
