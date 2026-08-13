# BuildAtlas Architecture

## System Architecture

```
                    ┌─────────────────────┐
                    │   React Frontend    │
                    │   TypeScript        │
                    │   Vite + Tailwind   │
                    │   React Router      │
                    │   TanStack Query    │
                    └──────────┬──────────┘
                               │
                            REST API
                               │
                    ┌──────────┴──────────┐
                    │    Express API      │
                    │    TypeScript       │
                    │    JWT Auth         │
                    │    Rate Limiting    │
                    └───────┬─────┬───────┘
                            │     │
                 ┌──────────┘     └──────────┐
                 ▼                           ▼
          ┌───────────────┐          ┌───────────────┐
          │   MongoDB     │          │     Redis     │
          │   Mongoose    │          │   Cache/Jobs  │
          └───────────────┘          └───────────────┘

                    External Services
                           │
             ┌─────────────┼─────────────┐
             ▼             ▼             ▼
         GitHub API      AWS S3       Sentry
```

## Backend Architecture

### Request Flow
```
Route → Middleware → Controller → Service → Repository/Model → MongoDB
```

### Directory Structure
```
backend/src/
├── config/           # Environment, database config
├── models/           # Mongoose schemas/models
├── services/         # Business logic layer
├── controllers/      # Request/response handlers
├── routes/           # API route definitions
├── middleware/        # Auth, error, rate limiting
├── utils/            # Helpers, seed data
└── types/            # TypeScript declarations
```

### Authentication Flow
1. User registers/logs in
2. Server generates JWT access token + refresh token
3. Access token sent in response body
4. Refresh token stored in HTTP-only cookie
5. Frontend stores access token in memory
6. On 401, frontend refreshes token using refresh cookie

### Key Design Decisions
- **Service Layer**: Business logic separated from controllers
- **Repository Pattern**: Models abstracted behind services
- **JWT + Refresh Tokens**: Stateless auth with secure refresh flow
- **MongoDB**: Flexible schema for varied project documentation
- **Redis**: Caching, rate limiting, background jobs

## Frontend Architecture

### Directory Structure
```
frontend/src/
├── features/         # Feature modules
│   ├── auth/         # Auth context, protected routes
│   └── projects/     # Project-related components
├── pages/            # Route page components
├── layouts/          # Layout wrappers
├── components/       # Shared components
├── hooks/            # Custom React hooks
├── services/         # API client
├── types/            # TypeScript types
└── lib/              # Utilities
```

### State Management
- **React Context**: Auth state (user, login, logout)
- **TanStack Query**: Server state (API data, caching)
- **Local State**: Component-specific state

### Routing
- `/` - Home page
- `/discover` - Project discovery
- `/projects/:slug` - Project page
- `/projects/new` - Create project
- `/projects/:id/edit` - Edit project
- `/u/:username` - User profile
- `/settings` - User settings
- `/admin` - Admin dashboard

## Database Design

### Core Collections
- `users` - User accounts and profiles
- `projects` - Project documentation
- `technologies` - Technology catalog
- `projectTechnologies` - Project-technology relationships
- `architectureDiagrams` - Architecture diagrams
- `databaseSchemas` - Database documentation
- `apiEndpoints` - API documentation
- `engineeringDecisions` - ADR records
- `problems` - Problem/solution documentation
- `timelineEvents` - Project timeline
- `deployments` - Deployment documentation
- `lessons` - Lessons learned
- `comments` - Project comments
- `likes` - Project likes
- `bookmarks` - Project bookmarks
- `follows` - User follow relationships
- `notifications` - User notifications
- `reports` - Content reports
- `projectViews` - View tracking
- `githubRepositories` - GitHub integration

### Indexes
- Text indexes on project name/description
- Compound indexes on common queries
- Unique indexes on slugs, usernames, emails
