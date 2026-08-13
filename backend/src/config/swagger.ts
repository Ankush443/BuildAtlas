import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import { Express } from 'express';
import { env } from '../config/env';

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'BuildAtlas API',
      version: '1.0.0',
      description: 'BuildAtlas - Developer Project Knowledge Platform API',
      contact: { name: 'BuildAtlas' },
    },
    servers: [
      { url: `http://localhost:${env.PORT}`, description: 'Development' },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
      schemas: {
        User: {
          type: 'object',
          properties: {
            _id: { type: 'string' },
            email: { type: 'string', format: 'email' },
            name: { type: 'string' },
            username: { type: 'string' },
            bio: { type: 'string' },
            avatar: { type: 'string' },
            skills: { type: 'array', items: { type: 'string' } },
            role: { type: 'string', enum: ['user', 'admin'] },
          },
        },
        Project: {
          type: 'object',
          properties: {
            _id: { type: 'string' },
            owner: { $ref: '#/components/schemas/User' },
            name: { type: 'string' },
            slug: { type: 'string' },
            shortDescription: { type: 'string' },
            fullDescription: { type: 'string' },
            category: { type: 'string' },
            projectType: { type: 'string' },
            difficulty: { type: 'string', enum: ['beginner', 'intermediate', 'advanced'] },
            status: { type: 'string' },
            visibility: { type: 'string', enum: ['draft', 'public', 'private'] },
            views: { type: 'number' },
            likesCount: { type: 'number' },
          },
        },
        SuccessResponse: {
          type: 'object',
          properties: {
            success: { type: 'boolean' },
            data: {},
            message: { type: 'string' },
          },
        },
        ErrorResponse: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: false },
            error: {
              type: 'object',
              properties: {
                code: { type: 'string' },
                message: { type: 'string' },
              },
            },
          },
        },
      },
    },
  },
  apis: ['./src/routes/*.ts'],
};

const swaggerSpec = swaggerJsdoc(options);

export const setupSwagger = (app: Express) => {
  app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
    customCss: '.swagger-ui .topbar { display: none }',
    customSiteTitle: 'BuildAtlas API Docs',
  }));
  app.get('/api/docs.json', (req, res) => res.json(swaggerSpec));
};
