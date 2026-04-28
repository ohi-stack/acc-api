import 'dotenv/config';
import { createApp } from './app.js';

const port = Number(process.env.PORT || 3010);
const app = createApp();

const server = app.listen(port, () => {
  console.log(`acc-api listening on ${port}`);
});

function shutdown(signal) {
  console.log(`${signal} received, shutting down acc-api`);
  server.close(() => process.exit(0));
}

process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));
