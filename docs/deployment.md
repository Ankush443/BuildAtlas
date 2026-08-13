# Deployment Guide

## Docker Deployment

### Build and run
```bash
docker compose -f docker-compose.yml up --build -d
```

### Stop
```bash
docker compose down
```

## AWS Deployment

### Architecture
```
Cloudflare / DNS
       │
       ▼
     Nginx
       │
       ├─────────────────┐
       ▼                 ▼
React Frontend      Express API
(S3 + CloudFront)   (ECS Fargate)
                         │
              ┌──────────┴──────────┐
              ▼                     ▼
          MongoDB Atlas           Redis
                                 (ElastiCache)
```

### Frontend (S3 + CloudFront)

1. Build frontend
```bash
cd frontend && npm run build
```

2. Create S3 bucket
```bash
aws s3 mb s3://buildatlas-frontend --region us-east-1
```

3. Enable static hosting
```bash
aws s3 website s3://buildatlas-frontend --index-document index.html --error-document index.html
```

4. Upload build
```bash
aws s3 sync dist/ s3://buildatlas-frontend --delete
```

5. Create CloudFront distribution
- Origin: S3 bucket
- Default root object: index.html
- Error responses: 403/404 → /index.html (SPA routing)

### Backend (ECS Fargate)

1. Create ECR repository
```bash
aws ecr create-repository --repository-name buildatlas-backend
```

2. Build and push Docker image
```bash
aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin <account-id>.dkr.ecr.us-east-1.amazonaws.com
docker build -t buildatlas-backend ./backend
docker tag buildatlas-backend:latest <account-id>.dkr.ecr.us-east-1.amazonaws.com/buildatlas-backend:latest
docker push <account-id>.dkr.ecr.us-east-1.amazonaws.com/buildatlas-backend:latest
```

3. Create ECS cluster
```bash
aws ecs create-cluster --cluster-name buildatlas
```

4. Create task definition and service

### Database (MongoDB Atlas)

1. Create cluster at cloud.mongodb.com
2. Create database user
3. Whitelist ECS task IPs
4. Get connection string

### Redis (ElastiCache)

1. Create Redis cluster
2. Update security group
3. Update REDIS_URL

### Environment Variables

Set in ECS task definition:
```
NODE_ENV=production
PORT=5000
MONGODB_URI=mongodb+srv://...
REDIS_URL=redis://...
JWT_ACCESS_SECRET=<generated>
JWT_REFRESH_SECRET=<generated>
AWS_REGION=us-east-1
AWS_S3_BUCKET=buildatlas-assets
GITHUB_CLIENT_ID=...
GITHUB_CLIENT_SECRET=...
CLIENT_URL=https://buildatlas.example.com
SENTRY_DSN=...
```

## Domain Setup

1. Register domain
2. Create Route 53 hosted zone
3. Add records:
   - `buildatlas.example.com` → CloudFront
   - `api.buildatlas.example.com` → ALB/ECS

## SSL/TLS

- CloudFront provides SSL for frontend
- ALB provides SSL for backend API
- Use AWS Certificate Manager for certificates

## Monitoring

### Sentry
1. Create project at sentry.io
2. Add DSN to environment
3. Frontend and backend error tracking

### CloudWatch
- ECS task logs
- API Gateway metrics
- RDS/ElastiCache metrics

## CI/CD (GitHub Actions)

Push to `main` triggers:
1. Lint and typecheck
2. Run tests
3. Build Docker images
4. Push to ECR
5. Deploy to ECS

Configure secrets in GitHub:
- `AWS_ACCESS_KEY_ID`
- `AWS_SECRET_ACCESS_KEY`
- `AWS_REGION`
