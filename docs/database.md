# Database Architecture

## Collections

### users
```typescript
{
  _id: ObjectId,
  email: string (unique, indexed),
  password: string (select: false),
  name: string,
  username: string (unique, indexed),
  bio: string,
  location: string,
  website: string,
  github: string,
  linkedin: string,
  avatar: string,
  skills: string[],
  role: 'user' | 'admin',
  isEmailVerified: boolean,
  refreshToken: string (select: false),
  followers: ObjectId[] (ref: User),
  following: ObjectId[] (ref: User),
  createdAt: Date,
  updatedAt: Date
}
```

### projects
```typescript
{
  _id: ObjectId,
  owner: ObjectId (ref: User, indexed),
  name: string,
  slug: string (unique, indexed),
  shortDescription: string,
  fullDescription: string,
  category: string (indexed),
  projectType: string (indexed),
  difficulty: 'beginner' | 'intermediate' | 'advanced',
  status: 'planning' | 'active-development' | 'production' | 'maintained' | 'archived',
  visibility: 'draft' | 'public' | 'private' (indexed),
  startDate: Date,
  endDate: Date,
  repositoryUrl: string,
  liveUrl: string,
  demoUrl: string,
  documentationUrl: string,
  license: string,
  coverImage: string,
  logo: string,
  views: number (indexed, descending),
  likesCount: number (indexed, descending),
  bookmarksCount: number,
  commentsCount: number,
  publishedAt: Date,
  createdAt: Date (indexed, descending),
  updatedAt: Date
}
```

### technologies
```typescript
{
  _id: ObjectId,
  name: string (unique, text indexed),
  slug: string (unique),
  category: 'frontend' | 'backend' | 'database' | 'ai-ml' | 'infrastructure' | 'tools' (indexed),
  logo: string,
  website: string,
  description: string
}
```

### projectTechnologies
```typescript
{
  _id: ObjectId,
  project: ObjectId (ref: Project, indexed),
  technology: ObjectId (ref: Technology),
  category: string,
  version: string,
  isPrimary: boolean,
  description: string
}
// Compound unique index: { project, technology }
```

### architectureDiagrams
```typescript
{
  _id: ObjectId,
  project: ObjectId (ref: Project, indexed),
  title: string,
  description: string,
  nodes: Mixed (React Flow nodes),
  edges: Mixed (React Flow edges)
}
```

### databaseSchemas
```typescript
{
  _id: ObjectId,
  project: ObjectId (ref: Project, indexed),
  name: string,
  description: string,
  collections: Mixed,
  relationships: Mixed
}
```

### apiEndpoints
```typescript
{
  _id: ObjectId,
  project: ObjectId (ref: Project, indexed),
  method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE',
  endpoint: string,
  description: string,
  authentication: boolean,
  parameters: Mixed,
  requestBody: Mixed,
  responseBody: Mixed,
  statusCodes: Mixed,
  exampleRequest: string,
  exampleResponse: string,
  order: number
}
```

### engineeringDecisions
```typescript
{
  _id: ObjectId,
  project: ObjectId (ref: Project, indexed),
  title: string,
  problem: string,
  context: string,
  options: string[],
  selectedSolution: string,
  reason: string,
  tradeoffs: string,
  consequences: string,
  status: 'proposed' | 'accepted' | 'deprecated' | 'superseded',
  date: Date
}
```

### problems
```typescript
{
  _id: ObjectId,
  project: ObjectId (ref: Project, indexed),
  title: string,
  description: string,
  symptoms: string,
  rootCause: string,
  investigation: string,
  failedApproaches: string[],
  finalSolution: string,
  result: string,
  lessonsLearned: string
}
```

### timelineEvents
```typescript
{
  _id: ObjectId,
  project: ObjectId (ref: Project, indexed),
  title: string,
  description: string,
  date: Date (indexed),
  image: string,
  githubRef: string
}
```

### deployments
```typescript
{
  _id: ObjectId,
  project: ObjectId (ref: Project, indexed),
  cloudProvider: string,
  frontendHosting: string,
  backendHosting: string,
  databaseHosting: string,
  objectStorage: string,
  cdn: string,
  cicd: string,
  docker: string,
  domain: string,
  environmentConfig: string,
  diagram: Mixed
}
```

### lessons
```typescript
{
  _id: ObjectId,
  project: ObjectId (ref: Project, indexed),
  title: string,
  content: string,
  category: 'technical' | 'architecture' | 'performance' | 'security' | 'product' | 'mistake' | 'development' (indexed)
}
```

### comments
```typescript
{
  _id: ObjectId,
  user: ObjectId (ref: User, indexed),
  project: ObjectId (ref: Project, indexed),
  content: string,
  parentComment: ObjectId (ref: Comment, indexed),
  likes: ObjectId[] (ref: User),
  createdAt: Date (indexed),
  updatedAt: Date
}
```

### likes
```typescript
{
  _id: ObjectId,
  user: ObjectId (ref: User),
  project: ObjectId (ref: Project, indexed)
}
// Compound unique index: { user, project }
```

### bookmarks
```typescript
{
  _id: ObjectId,
  user: ObjectId (ref: User, indexed),
  project: ObjectId (ref: Project, indexed),
  collection: string (default: 'default')
}
// Compound unique index: { user, project }
```

### follows
```typescript
{
  _id: ObjectId,
  follower: ObjectId (ref: User),
  following: ObjectId (ref: User, indexed)
}
// Compound unique index: { follower, following }
```

### notifications
```typescript
{
  _id: ObjectId,
  recipient: ObjectId (ref: User, indexed),
  sender: ObjectId (ref: User),
  type: 'follow' | 'like' | 'bookmark' | 'comment' | 'comment_reply',
  project: ObjectId (ref: Project),
  comment: ObjectId (ref: Comment),
  message: string,
  read: boolean (indexed),
  createdAt: Date (indexed)
}
```

### reports
```typescript
{
  _id: ObjectId,
  reporter: ObjectId (ref: User),
  targetType: 'project' | 'comment' | 'user' (indexed),
  targetId: ObjectId (indexed),
  reason: 'spam' | 'abuse' | 'copyright' | 'malicious' | 'misleading' | 'other',
  description: string,
  status: 'pending' | 'reviewed' | 'resolved' | 'rejected' (indexed),
  adminNote: string
}
```

### projectViews
```typescript
{
  _id: ObjectId,
  project: ObjectId (ref: Project, indexed),
  user: ObjectId (ref: User),
  ip: string,
  userAgent: string,
  createdAt: Date (indexed)
}
```

## Indexes Summary

| Collection | Index | Type |
|-----------|-------|------|
| users | email | Unique |
| users | username | Unique |
| users | name, text | Text |
| projects | slug | Unique |
| projects | owner | Compound |
| projects | category, status, visibility | Compound |
| projects | name, text | Text |
| projects | views, likesCount | Descending |
| projectTechnologies | project, technology | Unique |
| comments | project, createdAt | Compound |
| likes | user, project | Unique |
| bookmarks | user, project | Unique |
| follows | follower, following | Unique |
| notifications | recipient, read | Compound |
