# Development Setup

## Prerequisites

- Node.js 20+
- MongoDB 7+ (or MongoDB Atlas)
- Redis 7+ (optional for basic dev)
- npm or yarn

## Local Development

### 1. Clone and install
```bash
git clone https://github.com/yourusername/buildatlas.git
cd buildatlas

# Backend
cd backend && npm install

# Frontend
cd ../frontend && npm install
```

### 2. Environment setup
```bash
cp .env.example .env
```

Edit `.env` with your values:
- Generate JWT secrets: `node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"`
- MongoDB URI (local or Atlas)
- GitHub OAuth credentials (optional)

### 3. Start services

**Option A: Docker Compose (recommended)**
```bash
docker compose up
```

**Option B: Manual**
```bash
# Terminal 1: MongoDB
mongod

# Terminal 2: Redis (optional)
redis-server

# Terminal 3: Backend
cd backend && npm run dev

# Terminal 4: Frontend
cd frontend && npm run dev
```

### 4. Seed database
```bash
cd backend && npm run seed
```

### 5. Open browser
- Frontend: http://localhost:5173
- API: http://localhost:5000/api/v1/health

## Scripts

### Backend
```bash
npm run dev          # Start dev server with hot reload
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run typecheck    # Run TypeScript check
npm run test         # Run tests
npm run seed         # Seed database
```

### Frontend
```bash
npm run dev          # Start Vite dev server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint
npm run typecheck    # Run TypeScript check
```

## Testing

### Backend tests
```bash
cd backend
npm test             # Run all tests
npm run test:watch   # Watch mode
```

### Frontend tests
```bash
cd frontend
npm test             # Run all tests
```

## Debugging

### Backend
- Logs output to console
- Use `console.log` or attach debugger
- MongoDB errors shown in console

### Frontend
- React DevTools browser extension
- Vite HMR for instant updates
- Network tab for API calls

## Common Issues

### MongoDB connection refused
- Ensure MongoDB is running
- Check MONGODB_URI in .env
- For Atlas, check IP whitelist

### Port already in use
```bash
# Find process on port
lsof -i :5000
# Kill it
kill -9 <PID>
```

### TypeScript errors
```bash
npm run typecheck    # See all errors
```

## IDE Setup

### VS Code
Recommended extensions:
- ESLint
- Prettier
- Tailwind CSS IntelliSense
- TypeScript Importer
- MongoDB for VS Code
