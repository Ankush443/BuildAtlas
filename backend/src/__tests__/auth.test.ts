import { describe, it, expect, beforeAll, afterAll, beforeEach } from 'vitest';
import request from 'supertest';
import mongoose from 'mongoose';
import app from '../app';
import { User } from '../models/User';

let accessToken: string;
let userId: string;

beforeAll(async () => {
  await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/buildatlas-test');
});

afterAll(async () => {
  await User.deleteMany({});
  await mongoose.connection.close();
});

beforeEach(async () => {
  await User.deleteMany({});
});

describe('Auth', () => {
  it('should register a new user', async () => {
    const res = await request(app)
      .post('/api/v1/auth/register')
      .send({ email: 'test@test.com', password: 'password123', name: 'Test User', username: 'testuser' });
    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.user.email).toBe('test@test.com');
    expect(res.body.data.accessToken).toBeDefined();
    accessToken = res.body.data.accessToken;
    userId = res.body.data.user._id;
  });

  it('should login with valid credentials', async () => {
    await request(app).post('/api/v1/auth/register').send({ email: 'test@test.com', password: 'password123', name: 'Test', username: 'test' });
    const res = await request(app).post('/api/v1/auth/login').send({ email: 'test@test.com', password: 'password123' });
    expect(res.status).toBe(200);
    expect(res.body.data.accessToken).toBeDefined();
  });

  it('should reject invalid credentials', async () => {
    const res = await request(app).post('/api/v1/auth/login').send({ email: 'wrong@test.com', password: 'wrong' });
    expect(res.status).toBe(401);
  });

  it('should get current user', async () => {
    const regRes = await request(app).post('/api/v1/auth/register').send({ email: 'test@test.com', password: 'password123', name: 'Test', username: 'test' });
    const res = await request(app).get('/api/v1/auth/me').set('Authorization', `Bearer ${regRes.body.data.accessToken}`);
    expect(res.status).toBe(200);
    expect(res.body.data.username).toBe('test');
  });
});

describe('Health', () => {
  it('should return health status', async () => {
    const res = await request(app).get('/api/v1/health');
    expect(res.status).toBe(200);
    expect(res.body.data.status).toBe('ok');
  });
});
