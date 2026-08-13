import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import { User } from '../models/User';
import { Project } from '../models/Project';
import { Technology } from '../models/Technology';
import { ProjectTechnology } from '../models/ProjectTechnology';
import { EngineeringDecision } from '../models/EngineeringDecision';
import { Problem } from '../models/Problem';
import { TimelineEvent } from '../models/TimelineEvent';
import { Deployment } from '../models/Deployment';
import { Lesson } from '../models/Lesson';
import { Comment } from '../models/Comment';
import { Like } from '../models/Like';
import { Bookmark } from '../models/Bookmark';
import { env } from '../config/env';

const seedTechnologies = async () => {
  const techs = [
    { name: 'React', slug: 'react', category: 'frontend', website: 'https://react.dev' },
    { name: 'Next.js', slug: 'nextjs', category: 'frontend', website: 'https://nextjs.org' },
    { name: 'Vue', slug: 'vue', category: 'frontend', website: 'https://vuejs.org' },
    { name: 'Angular', slug: 'angular', category: 'frontend', website: 'https://angular.io' },
    { name: 'Node.js', slug: 'nodejs', category: 'backend', website: 'https://nodejs.org' },
    { name: 'Express', slug: 'express', category: 'backend', website: 'https://expressjs.com' },
    { name: 'NestJS', slug: 'nestjs', category: 'backend', website: 'https://nestjs.com' },
    { name: 'Django', slug: 'django', category: 'backend', website: 'https://djangoproject.com' },
    { name: 'MongoDB', slug: 'mongodb', category: 'database', website: 'https://mongodb.com' },
    { name: 'PostgreSQL', slug: 'postgresql', category: 'database', website: 'https://postgresql.org' },
    { name: 'Redis', slug: 'redis', category: 'database', website: 'https://redis.io' },
    { name: 'OpenAI', slug: 'openai', category: 'ai-ml', website: 'https://openai.com' },
    { name: 'PyTorch', slug: 'pytorch', category: 'ai-ml', website: 'https://pytorch.org' },
    { name: 'AWS', slug: 'aws', category: 'infrastructure', website: 'https://aws.amazon.com' },
    { name: 'Docker', slug: 'docker', category: 'infrastructure', website: 'https://docker.com' },
    { name: 'Kubernetes', slug: 'kubernetes', category: 'infrastructure', website: 'https://kubernetes.io' },
    { name: 'TypeScript', slug: 'typescript', category: 'tools', website: 'https://typescriptlang.org' },
    { name: 'Tailwind CSS', slug: 'tailwindcss', category: 'frontend', website: 'https://tailwindcss.com' },
    { name: 'React Flow', slug: 'reactflow', category: 'frontend', website: 'https://reactflow.dev' },
    { name: 'Recharts', slug: 'recharts', category: 'frontend', website: 'https://recharts.org' },
  ];

  for (const tech of techs) {
    await Technology.findOneAndUpdate({ slug: tech.slug }, tech, { upsert: true });
  }
  return Technology.find();
};

const seed = async () => {
  try {
    await mongoose.connect(env.MONGODB_URI);
    console.log('Connected to MongoDB');

    await User.deleteMany({});
    await Project.deleteMany({});
    await Technology.deleteMany({});
    await ProjectTechnology.deleteMany({});
    await EngineeringDecision.deleteMany({});
    await Problem.deleteMany({});
    await TimelineEvent.deleteMany({});
    await Deployment.deleteMany({});
    await Lesson.deleteMany({});
    await Comment.deleteMany({});
    await Like.deleteMany({});
    await Bookmark.deleteMany({});

    console.log('Cleared existing data');

    const hashedPassword = await bcrypt.hash('password123', 12);

    const users = await User.create([
      { email: 'demo@buildatlas.dev', password: hashedPassword, name: 'Demo User', username: 'demo', bio: 'Full-stack developer passionate about building great software.', location: 'San Francisco', skills: ['React', 'Node.js', 'MongoDB', 'TypeScript'], role: 'admin' },
      { email: 'sarah@example.com', password: hashedPassword, name: 'Sarah Chen', username: 'sarahchen', bio: 'AI/ML engineer building the future.', location: 'New York', skills: ['Python', 'PyTorch', 'TensorFlow', 'FastAPI'], role: 'user' },
      { email: 'marcus@example.com', password: hashedPassword, name: 'Marcus Johnson', username: 'marcusj', bio: 'Backend architect specializing in distributed systems.', location: 'Austin', skills: ['Go', 'Rust', 'PostgreSQL', 'Kubernetes'], role: 'user' },
      { email: 'elena@example.com', password: hashedPassword, name: 'Elena Rodriguez', username: 'elenar', bio: 'DevOps engineer and cloud infrastructure expert.', location: 'Seattle', skills: ['AWS', 'Docker', 'Terraform', 'CI/CD'], role: 'user' },
      { email: 'alex@example.com', password: hashedPassword, name: 'Alex Kim', username: 'alexkim', bio: 'Frontend developer creating beautiful user experiences.', location: 'Los Angeles', skills: ['React', 'Vue', 'CSS', 'Figma'], role: 'user' },
    ]);

    const technologies = await seedTechnologies();
    const getTech = (name: string) => technologies.find(t => t.name === name);

    const projects = await Project.create([
      {
        owner: users[0]._id, name: 'AI Resume Analyzer', slug: 'ai-resume-analyzer',
        shortDescription: 'An AI-powered tool that analyzes resumes and provides feedback on content, formatting, and job匹配度.',
        fullDescription: 'This project uses OpenAI GPT-4 to analyze resume content and provide detailed feedback. It parses PDF resumes, extracts key information, and compares it against job descriptions to score compatibility.',
        category: 'AI/ML', projectType: 'AI/ML', difficulty: 'advanced', status: 'production', visibility: 'public',
        repositoryUrl: 'https://github.com/demo/ai-resume-analyzer', liveUrl: 'https://resume-analyzer.example.com',
        views: 1250, likesCount: 89, bookmarksCount: 45, commentsCount: 12, publishedAt: new Date('2025-11-15'),
      },
      {
        owner: users[0]._id, name: 'Expense Tracker SaaS', slug: 'expense-tracker-saas',
        shortDescription: 'A personal finance tracking application with budgeting, analytics, and multi-currency support.',
        fullDescription: 'Full-stack expense tracking SaaS with real-time analytics, budget alerts, and bank integration via Plaid API.',
        category: 'SaaS', projectType: 'SaaS', difficulty: 'intermediate', status: 'production', visibility: 'public',
        repositoryUrl: 'https://github.com/demo/expense-tracker', liveUrl: 'https://expenses.example.com',
        views: 890, likesCount: 67, bookmarksCount: 34, commentsCount: 8, publishedAt: new Date('2025-10-01'),
      },
      {
        owner: users[1]._id, name: 'Knowledge Agent', slug: 'knowledge-agent',
        shortDescription: 'An AI agent that can search, summarize, and answer questions from a knowledge base of documents.',
        fullDescription: 'RAG-based AI agent using vector embeddings for semantic search across documents. Supports PDF, Markdown, and web pages.',
        category: 'AI/ML', projectType: 'AI/ML', difficulty: 'advanced', status: 'active-development', visibility: 'public',
        repositoryUrl: 'https://github.com/sarah/knowledge-agent', liveUrl: '',
        views: 2100, likesCount: 156, bookmarksCount: 98, commentsCount: 23, publishedAt: new Date('2026-01-20'),
      },
      {
        owner: users[2]._id, name: 'Distributed Task Queue', slug: 'distributed-task-queue',
        shortDescription: 'A high-performance distributed task queue built with Go and Redis for processing millions of jobs.',
        fullDescription: 'Production-grade task queue with priority levels, retry logic, dead letter queues, and real-time monitoring dashboard.',
        category: 'Developer Tools', projectType: 'Developer Tool', difficulty: 'advanced', status: 'production', visibility: 'public',
        repositoryUrl: 'https://github.com/marcus/taskqueue', liveUrl: '',
        views: 3400, likesCount: 234, bookmarksCount: 167, commentsCount: 31, publishedAt: new Date('2025-08-10'),
      },
      {
        owner: users[3]._id, name: 'Cloud Deploy CLI', slug: 'cloud-deploy-cli',
        shortDescription: 'A CLI tool for deploying applications to AWS with zero configuration.',
        fullDescription: 'Opinionated deployment CLI that handles infrastructure provisioning, Docker builds, and CI/CD setup.',
        category: 'Developer Tools', projectType: 'Developer Tool', difficulty: 'intermediate', status: 'maintained', visibility: 'public',
        repositoryUrl: 'https://github.com/elena/cloud-deploy', liveUrl: '',
        views: 1800, likesCount: 123, bookmarksCount: 89, commentsCount: 15, publishedAt: new Date('2025-09-05'),
      },
      {
        owner: users[4]._id, name: 'Component Library', slug: 'component-library',
        shortDescription: 'A modern React component library with accessibility, theming, and Storybook documentation.',
        fullDescription: 'Accessible React components following WAI-ARIA patterns with dark mode, RTL support, and comprehensive documentation.',
        category: 'Developer Tools', projectType: 'Open Source', difficulty: 'intermediate', status: 'production', visibility: 'public',
        repositoryUrl: 'https://github.com/alex/component-lib', liveUrl: 'https://components.example.com',
        views: 4500, likesCount: 312, bookmarksCount: 201, commentsCount: 42, publishedAt: new Date('2025-06-20'),
      },
    ]);

    const projectTechs = [
      { project: projects[0]._id, technology: getTech('React')!._id, category: 'frontend', isPrimary: true },
      { project: projects[0]._id, technology: getTech('Node.js')!._id, category: 'backend', isPrimary: true },
      { project: projects[0]._id, technology: getTech('OpenAI')!._id, category: 'ai-ml', isPrimary: true },
      { project: projects[0]._id, technology: getTech('MongoDB')!._id, category: 'database' },
      { project: projects[1]._id, technology: getTech('React')!._id, category: 'frontend', isPrimary: true },
      { project: projects[1]._id, technology: getTech('Node.js')!._id, category: 'backend', isPrimary: true },
      { project: projects[1]._id, technology: getTech('PostgreSQL')!._id, category: 'database', isPrimary: true },
      { project: projects[1]._id, technology: getTech('Redis')!._id, category: 'database' },
      { project: projects[2]._id, technology: getTech('Node.js')!._id, category: 'backend', isPrimary: true },
      { project: projects[2]._id, technology: getTech('OpenAI')!._id, category: 'ai-ml', isPrimary: true },
      { project: projects[2]._id, technology: getTech('MongoDB')!._id, category: 'database' },
      { project: projects[2]._id, technology: getTech('Redis')!._id, category: 'database' },
      { project: projects[3]._id, technology: getTech('Docker')!._id, category: 'infrastructure', isPrimary: true },
      { project: projects[3]._id, technology: getTech('Redis')!._id, category: 'database', isPrimary: true },
      { project: projects[3]._id, technology: getTech('Kubernetes')!._id, category: 'infrastructure' },
      { project: projects[4]._id, technology: getTech('Docker')!._id, category: 'infrastructure', isPrimary: true },
      { project: projects[4]._id, technology: getTech('AWS')!._id, category: 'infrastructure', isPrimary: true },
      { project: projects[5]._id, technology: getTech('React')!._id, category: 'frontend', isPrimary: true },
      { project: projects[5]._id, technology: getTech('TypeScript')!._id, category: 'tools', isPrimary: true },
      { project: projects[5]._id, technology: getTech('Tailwind CSS')!._id, category: 'frontend' },
    ];
    await ProjectTechnology.insertMany(projectTechs);

    await EngineeringDecision.insertMany([
      { project: projects[0]._id, title: 'MongoDB vs PostgreSQL', problem: 'The project required flexible project documentation structures.', options: ['MongoDB', 'PostgreSQL'], selectedSolution: 'MongoDB', reason: 'Project documentation contains highly variable nested structures.', tradeoffs: 'Less rigid schema compared to relational databases.', status: 'accepted', date: new Date('2025-10-01') },
      { project: projects[0]._id, title: 'OpenAI GPT-4 vs Local LLM', problem: 'Need to decide on AI model for resume analysis.', options: ['OpenAI GPT-4', 'Local LLM (Llama)', 'Claude API'], selectedSolution: 'OpenAI GPT-4', reason: 'Best accuracy for document analysis with minimal setup.', tradeoffs: 'API costs and latency vs self-hosted.', status: 'accepted', date: new Date('2025-10-15') },
      { project: projects[2]._id, title: 'Vector Database Selection', problem: 'Need efficient semantic search across documents.', options: ['Pinecone', 'MongoDB Atlas Vector Search', 'pgvector'], selectedSolution: 'MongoDB Atlas Vector Search', reason: 'Already using MongoDB, reduces infrastructure complexity.', tradeoffs: 'Less mature than dedicated vector databases.', status: 'accepted', date: new Date('2026-01-05') },
    ]);

    await Problem.insertMany([
      { project: projects[0]._id, title: 'PDF parsing accuracy', description: 'Resume PDFs had inconsistent formatting causing parsing errors.', symptoms: 'Missing sections, garbled text extraction', rootCause: 'PDF library not handling multi-column layouts', investigation: 'Tested pdf-parse, pdf2json, and PyPDF2', failedApproaches: ['pdf2json - poor multi-column support'], finalSolution: 'Switched to pdf-parse with custom post-processing', result: '99% parsing accuracy achieved', lessonsLearned: 'Always test with diverse real-world documents' },
      { project: projects[2]._id, title: 'Slow document indexing', description: 'Indexing large document collections took too long.', symptoms: 'API timeouts on documents > 100 pages', rootCause: 'Processing entire documents in single thread', investigation: 'Profiled the indexing pipeline', failedApproaches: ['Batch processing - still too slow'], finalSolution: 'Implemented worker threads with chunked processing', result: '10x improvement in indexing speed', lessonsLearned: 'Parallelize CPU-intensive work early' },
    ]);

    await TimelineEvent.insertMany([
      { project: projects[0]._id, title: 'Project Started', description: 'Initial concept and architecture design', date: new Date('2025-09-01') },
      { project: projects[0]._id, title: 'MVP Completed', description: 'Basic resume parsing and AI analysis working', date: new Date('2025-10-15') },
      { project: projects[0]._id, title: 'Production Launch', description: 'Deployed to AWS with full monitoring', date: new Date('2025-11-15') },
      { project: projects[2]._id, title: 'Project Started', description: 'RAG architecture research', date: new Date('2025-12-01') },
      { project: projects[2]._id, title: 'Vector Search Working', description: 'MongoDB Atlas vector search integration complete', date: new Date('2026-01-10') },
      { project: projects[2]._id, title: 'Beta Launch', description: 'Public beta with document upload', date: new Date('2026-01-20') },
    ]);

    await Deployment.insertMany([
      { project: projects[0]._id, cloudProvider: 'AWS', frontendHosting: 'S3 + CloudFront', backendHosting: 'AWS ECS Fargate', databaseHosting: 'MongoDB Atlas', objectStorage: 'AWS S3', cdn: 'CloudFront', cicd: 'GitHub Actions', docker: 'Docker Compose', domain: 'resume-analyzer.example.com' },
    ]);

    await Lesson.insertMany([
      { project: projects[0]._id, title: 'Test with real data early', content: 'Always test AI models with real-world data, not just synthetic test cases.', category: 'technical' },
      { project: projects[0]._id, title: 'Cache API responses', content: 'OpenAI API calls are expensive. Cache responses for similar inputs.', category: 'performance' },
      { project: projects[2]._id, title: 'Chunking strategy matters', content: 'Document chunking strategy significantly affects retrieval quality.', category: 'architecture' },
    ]);

    await Comment.insertMany([
      { user: users[1]._id, project: projects[0]._id, content: 'Great project! How do you handle different resume formats?' },
      { user: users[2]._id, project: projects[0]._id, content: 'The AI analysis is impressively accurate.' },
      { user: users[0]._id, project: projects[2]._id, content: 'Love the RAG approach. What embedding model are you using?' },
    ]);

    await Like.insertMany([
      { user: users[1]._id, project: projects[0]._id },
      { user: users[2]._id, project: projects[0]._id },
      { user: users[3]._id, project: projects[0]._id },
      { user: users[0]._id, project: projects[2]._id },
      { user: users[4]._id, project: projects[2]._id },
    ]);

    console.log('Seed data created successfully!');
    console.log('Demo account: demo@buildatlas.dev / password123');
    process.exit(0);
  } catch (error) {
    console.error('Seed error:', error);
    process.exit(1);
  }
};

seed();
