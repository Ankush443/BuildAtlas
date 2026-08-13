import app from './app';
import { env } from './config/env';
import { connectDatabase } from './config/database';

const start = async () => {
  await connectDatabase();
  app.listen(env.PORT, () => {
    console.log(`Server running on port ${env.PORT} in ${env.NODE_ENV} mode`);
  });
};

start().catch((error) => {
  console.error('Failed to start server:', error);
  process.exit(1);
});
