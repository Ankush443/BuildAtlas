# BuildAtlas - Developer Project Knowledge Platform

Explore how real software is designed, built, deployed, and learned from.

## Overview

BuildAtlas is a developer-focused project knowledge and discovery platform where developers document and explore the complete engineering story behind software projects.

**GitHub shows the code. BuildAtlas shows how the software was built.**

## Features

- **Project Documentation** - Document architecture, database design, API design, engineering decisions, problems, deployment, and lessons
- **Interactive Architecture Diagrams** - Create diagrams using React Flow
- **Project Discovery** - Search and filter projects by technology, category, difficulty
- **Community Features** - Like, bookmark, comment, follow developers
- **Analytics Dashboard** - Track views, likes, bookmarks, comments
- **GitHub Integration** - Import projects from GitHub repositories
- **Admin Dashboard** - Moderate users, projects, and reports

## Tech Stack

### Frontend
- React 18 + TypeScript
- Vite
- Tailwind CSS
- React Router
- TanStack Query
- React Hook Form + Zod
- React Flow (architecture diagrams)
- Recharts (analytics)
- Lucide Icons

### Backend
- Node.js + Express + TypeScript
- MongoDB + Mongoose
- Redis + BullMQ
- JWT Authentication (access + refresh tokens)
- bcryptjs (password hashing)

### Infrastructure
- Docker + Docker Compose
- GitHub Actions CI/CD
- AWS (S3, ECS, CloudFront)
- Sentry monitoring

## Quick Start

### Prerequisites
- Node.js 20+
- MongoDB 7+
- Redis 7+
- npm or yarn

### Development

1. Clone the repository
```bash
git clone https://github.com/yourusername/buildatlas.git
cd buildatlas
```

2. Install dependencies
```bash
cd backend && npm install
cd ../frontend && npm install
```

3. Set up environment variables
```bash
cp .env.example .env
# Edit .env with your configuration
```

4. Start with Docker Compose (recommended)
```bash
docker compose up
```

5. Or start manually
```bash
# Terminal 1 - Backend
cd backend && npm run dev

# Terminal 2 - Frontend
cd frontend && npm run dev
```

6. Seed the database
```bash
cd backend && npm run seed
```

7. Open http://localhost:5173

### Demo Account
- Email: `demo@buildatlas.dev`
- Password: `password123`

## Environment Variables

See `.env.example` for all required variables:

| Variable | Description | Default |
|----------|-------------|---------|
| `NODE_ENV` | Environment | development |
| `PORT` | Server port | 5000 |
| `MONGODB_URI` | MongoDB connection string | mongodb://localhost:27017/buildatlas |
| `JWT_ACCESS_SECRET` | JWT access token secret | - |
| `JWT_REFRESH_SECRET` | JWT refresh token secret | - |
| `REDIS_URL` | Redis connection string | redis://localhost:6379 |
| `AWS_S3_BUCKET` | S3 bucket name | buildatlas-assets |
| `GITHUB_CLIENT_ID` | GitHub OAuth client ID | - |
| `GITHUB_CLIENT_SECRET` | GitHub OAuth client secret | - |
| `CLIENT_URL` | Frontend URL | http://localhost:5173 |

## Project Structure

```
buildatlas/
├── frontend/          # React + TypeScript + Vite
│   └── src/
│       ├── features/  # Feature modules (auth, projects)
│       ├── pages/     # Route pages
│       ├── layouts/   # Layout components
│       ├── services/  # API services
│       ├── hooks/     # Custom hooks
│       └── types/     # TypeScript types
├── backend/           # Node.js + Express + TypeScript
│   └── src/
│       ├── config/    # Configuration
│       ├── models/    # Mongoose models
│       ├── services/  # Business logic
│       ├── controllers/ # Request handlers
│       ├── routes/    # API routes
│       ├── middleware/ # Auth, error handling
│       └── utils/     # Helpers, seed data
├── docs/              # Documentation
├── .github/workflows/ # CI/CD
├── docker-compose.yml
└── README.md
```

## API Documentation

See [docs/api.md](docs/api.md) for complete API documentation.

## Testing

```bash
# Backend tests
cd backend && npm test

# Frontend tests
cd frontend && npm test
```

## Deployment

### Docker
```bash
docker compose -f docker-compose.yml up --build -d
```

### AWS
See [docs/deployment.md](docs/deployment.md) for AWS deployment guide.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

MIT License - see [LICENSE](LICENSE) for details.
