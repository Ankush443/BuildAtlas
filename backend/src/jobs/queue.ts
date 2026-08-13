import { Queue, Worker, Job } from 'bullmq';
import { getRedisClient } from '../config/redis';

const connection = getRedisClient();

export const notificationQueue = connection ? new Queue('notifications', { connection: connection as any }) : null;
export const githubSyncQueue = connection ? new Queue('github-sync', { connection: connection as any }) : null;
export const analyticsQueue = connection ? new Queue('analytics', { connection: connection as any }) : null;

export const createWorker = (queueName: string, handler: (job: Job) => Promise<void>) => {
  if (!connection) return null;
  const worker = new Worker(queueName, handler, { connection: connection as any });
  worker.on('failed', (job, err) => console.error(`Job ${job?.id} in ${queueName} failed:`, err.message));
  worker.on('completed', (job) => console.log(`Job ${job.id} in ${queueName} completed`));
  return worker;
};

export const addJob = async (queue: Queue | null, jobName: string, data: any, opts?: any) => {
  if (!queue) return null;
  return queue.add(jobName, data, opts);
};
