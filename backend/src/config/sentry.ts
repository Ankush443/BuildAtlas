import * as Sentry from '@sentry/node';
import { ProfilingIntegration } from '@sentry/profiling-node';
import { env } from './env';

export const initSentry = () => {
  if (!env.SENTRY_DSN) {
    console.log('Sentry DSN not configured, skipping Sentry init');
    return;
  }

  Sentry.init({
    dsn: env.SENTRY_DSN,
    environment: env.NODE_ENV,
    integrations: [
      new Sentry.Integrations.Http({ tracing: true }),
      new Sentry.Integrations.Express({ app: undefined as any }),
      new ProfilingIntegration(),
    ],
    tracesSampleRate: env.isProduction ? 0.2 : 1.0,
    profilesSampleRate: 0.1,
  });

  console.log('Sentry initialized');
};

export const sentryMiddleware = Sentry.Handlers.requestHandler();
export const sentryErrorHandler = Sentry.Handlers.errorHandler();
