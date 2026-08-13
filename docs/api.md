# BuildAtlas API Documentation

## Base URL
```
http://localhost:5000/api/v1
```

## Authentication
All protected endpoints require a Bearer token in the Authorization header:
```
Authorization: Bearer <access_token>
```

## Response Format

### Success
```json
{
  "success": true,
  "data": {},
  "message": "Operation successful"
}
```

### Error
```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Error description",
    "details": []
  }
}
```

---

## Auth Endpoints

### POST /auth/register
Register a new user.

**Request:**
```json
{
  "email": "user@example.com",
  "password": "password123",
  "name": "John Doe",
  "username": "johndoe"
}
```

**Response:** 201
```json
{
  "success": true,
  "data": {
    "user": { "_id": "...", "name": "John Doe", "username": "johndoe", "email": "user@example.com" },
    "accessToken": "jwt_token"
  }
}
```

### POST /auth/login
Login with email and password.

**Request:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

### POST /auth/logout
Logout (requires auth). Clears refresh token.

### POST /auth/refresh
Refresh access token using refresh token cookie.

### GET /auth/me
Get current user profile (requires auth).

---

## User Endpoints

### GET /users/:username
Get user profile by username.

### PATCH /users/me
Update current user profile (requires auth).

### POST /users/:userId/follow
Follow a user (requires auth).

### DELETE /users/:userId/follow
Unfollow a user (requires auth).

### GET /users/:userId/followers
Get user's followers.

### GET /users/:userId/following
Get user's following list.

---

## Project Endpoints

### GET /projects
List public projects with filtering.

**Query Parameters:**
- `page` (number) - Page number
- `limit` (number) - Items per page (max 100)
- `category` (string) - Filter by category
- `projectType` (string) - Filter by project type
- `difficulty` (string) - Filter by difficulty
- `status` (string) - Filter by status
- `search` (string) - Full-text search
- `sort` (string) - Sort field (e.g., `-createdAt`, `views`)

### POST /projects
Create a new project (requires auth).

### GET /projects/:slug
Get project by slug (increments view count).

### PATCH /projects/:id
Update project (requires auth, must be owner).

### DELETE /projects/:id
Delete project (requires auth, must be owner).

### POST /projects/:id/publish
Publish project (requires auth).

### POST /projects/:id/unpublish
Unpublish project (requires auth).

### POST /projects/:id/like
Like a project (requires auth).

### DELETE /projects/:id/like
Unlike a project (requires auth).

### POST /projects/:id/bookmark
Bookmark a project (requires auth).

### DELETE /projects/:id/bookmark
Remove bookmark (requires auth).

### GET /projects/:id/comments
Get project comments.

### POST /projects/:id/comments
Add comment (requires auth).

### GET /projects/:id/analytics
Get project analytics (requires auth, must be owner).

---

## Technology Endpoints

### GET /technologies
List all technologies.

**Query Parameters:**
- `category` (string) - Filter by category

### GET /technologies/search?q=query
Search technologies by name.

### POST /projects/:projectId/technologies
Add technology to project (requires auth).

### DELETE /projects/:projectId/technologies/:techId
Remove technology from project (requires auth).

---

## Architecture Endpoints

### POST /projects/:projectId/architecture
Create architecture diagram (requires auth).

### GET /projects/:projectId/architecture
Get architecture diagrams.

### PATCH /projects/architecture/:id
Update diagram (requires auth).

### DELETE /projects/architecture/:id
Delete diagram (requires auth).

---

## Database Documentation Endpoints

### POST /projects/:projectId/database
Create database schema (requires auth).

### GET /projects/:projectId/database
Get database schemas.

### PATCH /projects/database/:id
Update schema (requires auth).

### DELETE /projects/database/:id
Delete schema (requires auth).

---

## API Documentation Endpoints

### POST /projects/:projectId/api-docs
Add API endpoint (requires auth).

### GET /projects/:projectId/api-docs
Get API endpoints.

### PATCH /projects/api-docs/:id
Update endpoint (requires auth).

### DELETE /projects/api-docs/:id
Delete endpoint (requires auth).

---

## Engineering Decisions Endpoints

### POST /projects/:projectId/decisions
Create decision (requires auth).

### GET /projects/:projectId/decisions
Get decisions.

### PATCH /projects/decisions/:id
Update decision (requires auth).

### DELETE /projects/decisions/:id
Delete decision (requires auth).

---

## Problems Endpoints

### POST /projects/:projectId/problems
Create problem (requires auth).

### GET /projects/:projectId/problems
Get problems.

### PATCH /projects/problems/:id
Update problem (requires auth).

### DELETE /projects/problems/:id
Delete problem (requires auth).

---

## Timeline Endpoints

### POST /projects/:projectId/timeline
Create event (requires auth).

### GET /projects/:projectId/timeline
Get timeline events.

### PATCH /projects/timeline/:id
Update event (requires auth).

### DELETE /projects/timeline/:id
Delete event (requires auth).

---

## Deployment Endpoints

### POST /projects/:projectId/deployment
Create/update deployment docs (requires auth).

### GET /projects/:projectId/deployment
Get deployment docs.

---

## Lessons Endpoints

### POST /projects/:projectId/lessons
Create lesson (requires auth).

### GET /projects/:projectId/lessons
Get lessons.

### PATCH /projects/lessons/:id
Update lesson (requires auth).

### DELETE /projects/lessons/:id
Delete lesson (requires auth).

---

## Notification Endpoints

### GET /notifications
Get user notifications (requires auth).

### GET /notifications/unread-count
Get unread count (requires auth).

### PATCH /notifications/:id/read
Mark as read (requires auth).

### POST /notifications/read-all
Mark all as read (requires auth).

---

## Bookmark Endpoints

### GET /bookmarks
Get user's bookmarks (requires auth).

---

## GitHub Endpoints

### POST /github/repositories
Get user's GitHub repositories (requires auth).

### POST /github/import
Import project from GitHub (requires auth).

---

## Admin Endpoints (Admin only)

### GET /admin/users
List all users.

### GET /admin/projects
List all projects.

### POST /admin/users/:userId/suspend
Suspend a user.

### POST /admin/projects/:projectId/hide
Hide a project.

### DELETE /admin/comments/:commentId
Delete a comment.

### GET /admin/reports
List reports.

### POST /admin/reports/:reportId/resolve
Resolve a report.

### POST /admin/reports/:reportId/reject
Reject a report.

### GET /admin/analytics
Get platform analytics.

---

## Report Endpoints

### POST /reports
Submit a report (requires auth).

---

## Health Check

### GET /health
```json
{
  "success": true,
  "data": { "status": "ok", "timestamp": "2026-01-01T00:00:00.000Z" }
}
```
