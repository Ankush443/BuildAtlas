import { S3Client, PutObjectCommand, DeleteObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { env } from '../config/env';
import { v4 as uuid } from 'uuid';
import path from 'path';

const s3Client = new S3Client({
  region: env.AWS_REGION,
  credentials: {
    accessKeyId: env.AWS_ACCESS_KEY_ID,
    secretAccessKey: env.AWS_SECRET_ACCESS_KEY,
  },
});

const BUCKET = env.AWS_S3_BUCKET;

export const uploadFile = async (file: Express.Multer.File, folder = 'uploads'): Promise<string> => {
  const ext = path.extname(file.originalname);
  const key = `${folder}/${uuid()}${ext}`;

  await s3Client.send(new PutObjectCommand({
    Bucket: BUCKET,
    Key: key,
    Body: file.buffer,
    ContentType: file.mimetype,
  }));

  return `https://${BUCKET}.s3.${env.AWS_REGION}.amazonaws.com/${key}`;
};

export const deleteFile = async (key: string): Promise<void> => {
  await s3Client.send(new DeleteObjectCommand({ Bucket: BUCKET, Key: key }));
};

export const getPresignedUrl = async (key: string, expiresIn = 3600): Promise<string> => {
  const command = new GetObjectCommand({ Bucket: BUCKET, Key: key });
  return getSignedUrl(s3Client, command, { expiresIn });
};
