import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import request from 'supertest';
import mongoose from 'mongoose';
import app from '../app';
import { User } from '../models/User';
import { Project } from '../models/Project';

let accessToken: string;
let userId: string;

beforeAll(async () => {
  await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/buildatlas-test');
  const regRes = await request(app).post('/api/v1/auth/register').send({ email: 'test@test.com', password: 'password123', name: 'Test', username: 'test' });
  accessToken = regRes.body.data.accessToken;
  userId = regRes.body.data.user._id;
});

afterAll(async () => {
  await User.deleteMany({});
  await Project.deleteMany({});
  await mongoose.connection.close();
});

describe('Projects', () => {
  it('should create a project', async () => {
    const res = await request(app).post('/api/v1/projects').set('Authorization', `Bearer ${accessToken}`).send({ name: 'Test Project', shortDescription: 'A test project', category: 'Web', projectType: 'Web Application' });
    expect(res.status).toBe(201);
    expect(res.body.data.name).toBe('Test Project');
  });

  it('should list projects', async () => {
    await request(app).post('/api/v1/projects').set('Authorization', `Bearer ${accessToken}`).send({ name: 'Project 1', shortDescription: 'Desc', category: 'Web', projectType: 'Web Application', visibility: 'public' });
    const res = await request(app).get('/api/v1/projects');
    expect(res.status).toBe(200);
    expect(res.body.data.projects).toBeDefined();
  });

  it('should get project by slug', async () => {
    await request(app).post('/api/v1/projects').set('Authorization', `Bearer ${accessToken}`).send({ name: 'Slug Test', shortDescription: 'Desc', category: 'Web', projectType: 'Web Application', visibility: 'public' });
    const res = await request(app).get('/api/v1/projects/slug-test');
    expect(res.status).toBe(200);
    expect(res.body.data.slug).toBe('slug-test');
  });

  it('should require auth for creation', async () => {
    const res = await request(app).post('/api/v1/projects').send({ name: 'No Auth', shortDescription: 'Desc', category: 'Web', projectType: 'Web Application' });
    expect(res.status).toBe(401);
  });
});
