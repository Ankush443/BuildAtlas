import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import { env } from './config/env';
import { errorHandler } from './middleware/error.middleware';
import { apiLimiter } from './middleware/rateLimit.middleware';
import { setupSwagger } from './config/swagger';
import { initSentry, sentryMiddleware, sentryErrorHandler } from './config/sentry';
import { getRedisClient } from './config/redis';

import authRoutes from './routes/auth.routes';
import usersRoutes from './routes/users.routes';
import projectsRoutes from './routes/projects.routes';
import technologiesRoutes from './routes/technologies.routes';
import notificationsRoutes from './routes/notifications.routes';
import bookmarksRoutes from './routes/bookmarks.routes';
import githubRoutes from './routes/github.routes';
import adminRoutes from './routes/admin.routes';
import discoverRoutes from './routes/discover.routes';

initSentry();

const app = express();

if (env.SENTRY_DSN) app.use(sentryMiddleware);

app.use(helmet());
app.use(cors({ origin: env.CLIENT_URL, credentials: true }));
app.use(compression());
app.use(morgan('dev'));
app.use(cookieParser());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

app.use('/api', apiLimiter);

app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/users', usersRoutes);
app.use('/api/v1/projects', projectsRoutes);
app.use('/api/v1/technologies', technologiesRoutes);
app.use('/api/v1/notifications', notificationsRoutes);
app.use('/api/v1/bookmarks', bookmarksRoutes);
app.use('/api/v1/github', githubRoutes);
app.use('/api/v1/admin', adminRoutes);
app.use('/api/v1/discover', discoverRoutes);

setupSwagger(app);

app.get('/api/v1/health', async (req, res) => {
  const redis = getRedisClient();
  const redisStatus = redis ? 'connected' : 'unavailable';
  res.json({ success: true, data: { status: 'ok', redis: redisStatus, timestamp: new Date().toISOString() } });
});

if (env.SENTRY_DSN) app.use(sentryErrorHandler);
app.use(errorHandler);

export default app;
