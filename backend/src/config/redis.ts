import Redis from 'ioredis';
import { env } from '../config/env';

let redisClient: Redis | null = null;

export const getRedisClient = (): Redis | null => {
  if (!redisClient) {
    try {
      redisClient = new Redis(env.REDIS_URL, {
        maxRetriesPerRequest: 3,
        retryStrategy(times) {
          if (times > 3) return null;
          return Math.min(times * 200, 2000);
        },
      });
      redisClient.on('connect', () => console.log('Redis connected'));
      redisClient.on('error', (err) => console.error('Redis error:', err.message));
    } catch (error) {
      console.warn('Redis not available, running without cache');
      return null;
    }
  }
  return redisClient;
};

export const cacheGet = async (key: string): Promise<string | null> => {
  const client = getRedisClient();
  if (!client) return null;
  return client.get(key);
};

export const cacheSet = async (key: string, value: string, ttlSeconds = 3600): Promise<void> => {
  const client = getRedisClient();
  if (!client) return;
  await client.set(key, value, 'EX', ttlSeconds);
};

export const cacheDel = async (key: string): Promise<void> => {
  const client = getRedisClient();
  if (!client) return;
  await client.del(key);
};

export const disconnectRedis = async (): Promise<void> => {
  if (redisClient) {
    await redisClient.quit();
    redisClient = null;
  }
};
