export interface User {
  _id: string;
  email: string;
  name: string;
  username: string;
  bio: string;
  location: string;
  website: string;
  github: string;
  linkedin: string;
  avatar: string;
  skills: string[];
  role: string;
  followers: string[];
  following: string[];
  createdAt: string;
  updatedAt: string;
}

export interface Project {
  _id: string;
  owner: User;
  name: string;
  slug: string;
  shortDescription: string;
  fullDescription: string;
  category: string;
  projectType: string;
  difficulty: string;
  status: string;
  visibility: string;
  startDate?: string;
  endDate?: string;
  repositoryUrl: string;
  liveUrl: string;
  demoUrl: string;
  documentationUrl: string;
  license: string;
  coverImage: string;
  logo: string;
  views: number;
  likesCount: number;
  bookmarksCount: number;
  commentsCount: number;
  publishedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Technology {
  _id: string;
  name: string;
  slug: string;
  category: string;
  logo: string;
  website: string;
  description: string;
}

export interface ProjectTechnology {
  _id: string;
  project: string;
  technology: Technology;
  category: string;
  version: string;
  isPrimary: boolean;
  description: string;
}

export interface ArchitectureDiagram {
  _id: string;
  project: string;
  title: string;
  description: string;
  nodes: any[];
  edges: any[];
}

export interface DatabaseSchema {
  _id: string;
  project: string;
  name: string;
  description: string;
  collections: any[];
  relationships: any[];
}

export interface ApiEndpoint {
  _id: string;
  project: string;
  method: string;
  endpoint: string;
  description: string;
  authentication: boolean;
  parameters: any[];
  requestBody: any;
  responseBody: any;
  statusCodes: any[];
  exampleRequest: string;
  exampleResponse: string;
}

export interface EngineeringDecision {
  _id: string;
  project: string;
  title: string;
  problem: string;
  context: string;
  options: string[];
  selectedSolution: string;
  reason: string;
  tradeoffs: string;
  consequences: string;
  status: string;
  date: string;
}

export interface Problem {
  _id: string;
  project: string;
  title: string;
  description: string;
  symptoms: string;
  rootCause: string;
  investigation: string;
  failedApproaches: string[];
  finalSolution: string;
  result: string;
  lessonsLearned: string;
}

export interface TimelineEvent {
  _id: string;
  project: string;
  title: string;
  description: string;
  date: string;
  image: string;
  githubRef: string;
}

export interface Deployment {
  _id: string;
  project: string;
  cloudProvider: string;
  frontendHosting: string;
  backendHosting: string;
  databaseHosting: string;
  objectStorage: string;
  cdn: string;
  cicd: string;
  docker: string;
  domain: string;
  environmentConfig: string;
}

export interface Lesson {
  _id: string;
  project: string;
  title: string;
  content: string;
  category: string;
}

export interface Comment {
  _id: string;
  user: User;
  project: string;
  content: string;
  parentComment?: string;
  likes: string[];
  createdAt: string;
}

export interface Notification {
  _id: string;
  recipient: string;
  sender: User;
  type: string;
  project?: { name: string; slug: string };
  message: string;
  read: boolean;
  createdAt: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  error?: { code: string; message: string; details?: any[] };
}
