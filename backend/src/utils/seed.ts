import mongoose from 'mongoose';
import { User } from '../models/User';
import { Project } from '../models/Project';
import { Technology } from '../models/Technology';
import { ProjectTechnology } from '../models/ProjectTechnology';
import { ArchitectureDiagram } from '../models/ArchitectureDiagram';
import { DatabaseSchema } from '../models/DatabaseSchema';
import { ApiEndpoint } from '../models/ApiEndpoint';
import { EngineeringDecision } from '../models/EngineeringDecision';
import { Problem } from '../models/Problem';
import { TimelineEvent } from '../models/TimelineEvent';
import { Deployment } from '../models/Deployment';
import { Lesson } from '../models/Lesson';
import { Comment } from '../models/Comment';
import { Like } from '../models/Like';
import { Bookmark } from '../models/Bookmark';
import { CommunityPost } from '../models/CommunityPost';
import { CommunityComment } from '../models/CommunityComment';
import { DirectMessage } from '../models/DirectMessage';
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
    await ArchitectureDiagram.deleteMany({});
    await DatabaseSchema.deleteMany({});
    await ApiEndpoint.deleteMany({});
    await EngineeringDecision.deleteMany({});
    await Problem.deleteMany({});
    await TimelineEvent.deleteMany({});
    await Deployment.deleteMany({});
    await Lesson.deleteMany({});
    await Comment.deleteMany({});
    await Like.deleteMany({});
    await Bookmark.deleteMany({});
    await CommunityPost.deleteMany({});
    await CommunityComment.deleteMany({});
    await DirectMessage.deleteMany({});

    console.log('Cleared existing data');

    // Pass plaintext: the User pre('save') hook hashes it once.
    const demoPassword = 'password123';

    const users = await User.create([
      { email: 'demo@buildatlas.dev', password: demoPassword, name: 'Demo User', username: 'demo', bio: 'Full-stack developer passionate about building great software.', location: 'San Francisco', skills: ['React', 'Node.js', 'MongoDB', 'TypeScript'], role: 'admin' },
      { email: 'sarah@example.com', password: demoPassword, name: 'Sarah Chen', username: 'sarahchen', bio: 'AI/ML engineer building the future.', location: 'New York', skills: ['Python', 'PyTorch', 'TensorFlow', 'FastAPI'], role: 'user' },
      { email: 'marcus@example.com', password: demoPassword, name: 'Marcus Johnson', username: 'marcusj', bio: 'Backend architect specializing in distributed systems.', location: 'Austin', skills: ['Go', 'Rust', 'PostgreSQL', 'Kubernetes'], role: 'user' },
      { email: 'elena@example.com', password: demoPassword, name: 'Elena Rodriguez', username: 'elenar', bio: 'DevOps engineer and cloud infrastructure expert.', location: 'Seattle', skills: ['AWS', 'Docker', 'Terraform', 'CI/CD'], role: 'user' },
      { email: 'alex@example.com', password: demoPassword, name: 'Alex Kim', username: 'alexkim', bio: 'Frontend developer creating beautiful user experiences.', location: 'Los Angeles', skills: ['React', 'Vue', 'CSS', 'Figma'], role: 'user' },
    ]);

    const technologies = await seedTechnologies();
    const getTech = (name: string) => technologies.find(t => t.name === name);

    const projects = await Project.create([
      {
        owner: users[0]._id, name: 'AI Resume Analyzer', slug: 'ai-resume-analyzer',
        shortDescription: 'An AI-powered tool that analyzes resumes and gives feedback on content, formatting, and job fit.',
        fullDescription: 'This project uses OpenAI GPT-4 to analyze resume content and provide detailed feedback. It parses PDF resumes, extracts key information, and compares them against job descriptions to produce a compatibility score.\n\nThe system is split into a document-ingestion service and an analysis service. Ingestion handles PDF/DOCX parsing and normalises the text into a structured format. Analysis sends the normalised text plus a job description to GPT-4, which returns structured JSON containing a match score, strengths, gaps, and rewrite suggestions.\n\nResults are cached by content hash so re-analysing the same resume against the same job costs nothing. A weekly digest email surfaces score changes for previously submitted applications.',
        category: 'AI/ML', projectType: 'AI/ML', difficulty: 'advanced', status: 'production', visibility: 'public',
        repositoryUrl: 'https://github.com/demo/ai-resume-analyzer', liveUrl: 'https://resume-analyzer.example.com',
        documentationUrl: 'https://docs.resume-analyzer.example.com', license: 'MIT',
        views: 1250, likesCount: 89, bookmarksCount: 45, commentsCount: 12, publishedAt: new Date('2025-11-15'),
      },
      {
        owner: users[0]._id, name: 'Expense Tracker SaaS', slug: 'expense-tracker-saas',
        shortDescription: 'A personal finance tracking application with budgeting, analytics, and multi-currency support.',
        fullDescription: 'Full-stack expense tracking SaaS with real-time analytics, budget alerts, and bank integration via the Plaid API.\n\nTransactions are imported asynchronously: Plaid webhooks push new transactions into a queue, a worker normalises and categorises them, and the ledger is updated. Categorisation uses a rules engine first (merchant keyword matching) and falls back to a small trained classifier for anything the rules miss.\n\nBudgets are evaluated on a rolling window so a user can set "500 per month" and see the pace rather than a hard cutoff. Alerts fire when projected spend exceeds the budget before the period ends, which gives users time to react instead of a notification after they have already overspent.\n\nMulti-currency support stores every amount in both the original currency and a normalised base currency using the rate at transaction time, so historical reports do not change when rates move.',
        category: 'SaaS', projectType: 'SaaS', difficulty: 'intermediate', status: 'production', visibility: 'public',
        repositoryUrl: 'https://github.com/demo/expense-tracker', liveUrl: 'https://expenses.example.com',
        documentationUrl: 'https://docs.expenses.example.com', license: 'MIT',
        views: 890, likesCount: 67, bookmarksCount: 34, commentsCount: 8, publishedAt: new Date('2025-10-01'),
      },
      {
        owner: users[1]._id, name: 'Knowledge Agent', slug: 'knowledge-agent',
        shortDescription: 'An AI agent that can search, summarize, and answer questions from a knowledge base of documents.',
        fullDescription: 'RAG-based AI agent using vector embeddings for semantic search across documents. Supports PDF, Markdown, and web pages.\n\nDocuments are chunked on semantic boundaries (headings and paragraphs) rather than a fixed token window, then embedded and stored with their source metadata. Retrieval runs a hybrid search: dense vector similarity is combined with BM25 keyword scoring, which noticeably improves recall on questions containing specific identifiers like error codes or table names.\n\nEvery answer cites the document and chunk it came from. When retrieval confidence is low the agent says so instead of guessing, which is far more useful than a confident wrong answer. A feedback endpoint records thumbs up/down per answer, and those signals feed an evaluation set used to gate prompt changes before release.',
        category: 'AI/ML', projectType: 'AI/ML', difficulty: 'advanced', status: 'active-development', visibility: 'public',
        repositoryUrl: 'https://github.com/sarah/knowledge-agent',
        documentationUrl: 'https://github.com/sarah/knowledge-agent#readme', license: 'Apache-2.0',
        views: 2100, likesCount: 156, bookmarksCount: 98, commentsCount: 23, publishedAt: new Date('2026-01-20'),
      },
      {
        owner: users[2]._id, name: 'Distributed Task Queue', slug: 'distributed-task-queue',
        shortDescription: 'A high-performance distributed task queue built with Go and Redis for processing millions of jobs.',
        fullDescription: 'Production-grade task queue with priority levels, retry logic, dead letter queues, and a real-time monitoring dashboard.\n\nJobs are pushed onto Redis lists and workers block on BRPOPLPUSH, which gives at-least-once delivery with a reliable processing list. Each worker moves a job to its in-progress list before starting, so a crashed worker leaves the job recoverable rather than lost.\n\nRetries use exponential backoff with jitter, capped at a maximum attempt count. Exhausted jobs land in a dead letter queue that is inspectable from the dashboard and can be replayed after a fix.\n\nThe queue is at-least-once rather than exactly-once on purpose. Exactly-once delivery is not achievable without distributed transactions across the queue and the consumer datastore, and the honest answer is that job handlers should be idempotent. The documentation pushes that responsibility explicitly to the consumer instead of hiding it.',
        category: 'Developer Tools', projectType: 'Developer Tool', difficulty: 'advanced', status: 'production', visibility: 'public',
        repositoryUrl: 'https://github.com/marcus/taskqueue', documentationUrl: 'https://taskqueue.dev/docs', license: 'MIT',
        views: 3400, likesCount: 234, bookmarksCount: 167, commentsCount: 31, publishedAt: new Date('2025-08-10'),
      },
      {
        owner: users[3]._id, name: 'Cloud Deploy CLI', slug: 'cloud-deploy-cli',
        shortDescription: 'A CLI tool for deploying applications to AWS with zero configuration.',
        fullDescription: 'Opinionated deployment CLI that handles infrastructure provisioning, Docker builds, and CI/CD setup.\n\nThe CLI reads a single declarative manifest and reconciles the difference between declared and actual cloud state, so re-running a deploy is safe and converges rather than duplicating resources. It generates CloudFormation templates internally, which means there is no second config file to keep in sync.\n\nRollbacks are first-class. Every deploy records the previous task definition revision, so `deploy rollback` is a supported operation rather than an emergency procedure you write under pressure.\n\nSecrets are never written to disk. They are read from AWS Secrets Manager at deploy time and injected into the running task, so a developer never handles a production credential.',
        category: 'Developer Tools', projectType: 'Developer Tool', difficulty: 'intermediate', status: 'maintained', visibility: 'public',
        repositoryUrl: 'https://github.com/elena/cloud-deploy', documentationUrl: 'https://cloud-deploy.dev', license: 'MIT',
        views: 1800, likesCount: 123, bookmarksCount: 89, commentsCount: 15, publishedAt: new Date('2025-09-05'),
      },
      {
        owner: users[4]._id, name: 'Component Library', slug: 'component-library',
        shortDescription: 'A modern React component library with accessibility, theming, and Storybook documentation.',
        fullDescription: 'Accessible React components following WAI-ARIA patterns with dark mode, RTL support, and comprehensive documentation.\n\nAccessibility is a release gate, not an aspiration. Every interactive component ships with keyboard interaction tests and axe-core checks in CI, and a component cannot be published if either fails. Focus management for modals, menus, and comboboxes was the hardest part and is handled per WAI-ARIA authoring practices rather than by pattern-matching other libraries.\n\nTheming runs through CSS custom properties so a consumer can retheme without rebuilding. Dark mode and RTL are both driven from the same token layer, which means adding a new theme does not require touching component internals.\n\nThe package is tree-shakeable and side-effect free, keeping a consumer bundle small even when they import only a handful of components.',
        category: 'Developer Tools', projectType: 'Open Source', difficulty: 'intermediate', status: 'production', visibility: 'public',
        repositoryUrl: 'https://github.com/alex/component-lib', liveUrl: 'https://components.example.com',
        documentationUrl: 'https://components.example.com/docs', license: 'MIT',
        views: 4500, likesCount: 312, bookmarksCount: 201, commentsCount: 42, publishedAt: new Date('2025-06-20'),
      },
    ]);

    const projectTechs = [
      { project: projects[0]._id, technology: getTech('React')!._id, category: 'frontend', isPrimary: true },
      { project: projects[0]._id, technology: getTech('Node.js')!._id, category: 'backend', isPrimary: true },
      { project: projects[0]._id, technology: getTech('OpenAI')!._id, category: 'ai-ml', isPrimary: true },
      { project: projects[0]._id, technology: getTech('MongoDB')!._id, category: 'database' },
      { project: projects[0]._id, technology: getTech('Redis')!._id, category: 'database' },
      { project: projects[0]._id, technology: getTech('Docker')!._id, category: 'infrastructure' },
      { project: projects[1]._id, technology: getTech('React')!._id, category: 'frontend', isPrimary: true },
      { project: projects[1]._id, technology: getTech('Node.js')!._id, category: 'backend', isPrimary: true },
      { project: projects[1]._id, technology: getTech('PostgreSQL')!._id, category: 'database', isPrimary: true },
      { project: projects[1]._id, technology: getTech('Redis')!._id, category: 'database' },
      { project: projects[1]._id, technology: getTech('Docker')!._id, category: 'infrastructure' },
      { project: projects[2]._id, technology: getTech('Node.js')!._id, category: 'backend', isPrimary: true },
      { project: projects[2]._id, technology: getTech('OpenAI')!._id, category: 'ai-ml', isPrimary: true },
      { project: projects[2]._id, technology: getTech('MongoDB')!._id, category: 'database' },
      { project: projects[2]._id, technology: getTech('Redis')!._id, category: 'database' },
      { project: projects[2]._id, technology: getTech('Docker')!._id, category: 'infrastructure' },
      { project: projects[3]._id, technology: getTech('Redis')!._id, category: 'database', isPrimary: true },
      { project: projects[3]._id, technology: getTech('Docker')!._id, category: 'infrastructure', isPrimary: true },
      { project: projects[3]._id, technology: getTech('Kubernetes')!._id, category: 'infrastructure' },
      { project: projects[4]._id, technology: getTech('Docker')!._id, category: 'infrastructure', isPrimary: true },
      { project: projects[4]._id, technology: getTech('AWS')!._id, category: 'infrastructure', isPrimary: true },
      { project: projects[4]._id, technology: getTech('Kubernetes')!._id, category: 'infrastructure' },
      { project: projects[5]._id, technology: getTech('React')!._id, category: 'frontend', isPrimary: true },
      { project: projects[5]._id, technology: getTech('TypeScript')!._id, category: 'tools', isPrimary: true },
      { project: projects[5]._id, technology: getTech('Tailwind CSS')!._id, category: 'frontend' },
      { project: projects[5]._id, technology: getTech('React Flow')!._id, category: 'frontend' },
    ];
    await ProjectTechnology.insertMany(projectTechs);

    await ArchitectureDiagram.insertMany([
      {
        project: projects[0]._id, title: 'Resume Analysis Pipeline', description: 'Document ingestion and AI analysis flow.',
        nodes: [
          { id: '1', type: 'input', position: { x: 40, y: 120 }, data: { label: 'Resume PDF / DOCX' } },
          { id: '2', type: 'default', position: { x: 250, y: 120 }, data: { label: 'Ingestion Service\n(parse + normalise)' } },
          { id: '3', type: 'default', position: { x: 470, y: 40 }, data: { label: 'Redis Cache\n(content-hash)' } },
          { id: '4', type: 'default', position: { x: 470, y: 200 }, data: { label: 'Analysis Service\n(GPT-4)' } },
          { id: '5', type: 'output', position: { x: 700, y: 120 }, data: { label: 'Scored Feedback' } },
        ],
        edges: [
          { id: 'e1', source: '1', target: '2', animated: true },
          { id: 'e2', source: '2', target: '3', label: 'cache hit' },
          { id: 'e3', source: '2', target: '4', label: 'cache miss' },
          { id: 'e4', source: '4', target: '3', label: 'store result' },
          { id: 'e5', source: '4', target: '5' },
        ],
      },
      {
        project: projects[3]._id, title: 'Queue Worker Topology', description: 'Producer to worker to datastore, with dead letter path.',
        nodes: [
          { id: 'q1', type: 'input', position: { x: 40, y: 140 }, data: { label: 'Producers' } },
          { id: 'q2', type: 'default', position: { x: 250, y: 140 }, data: { label: 'Redis Pending List\n(BRPOPLPUSH)' } },
          { id: 'w1', type: 'default', position: { x: 480, y: 40 }, data: { label: 'Worker A\n(processing list)' } },
          { id: 'w2', type: 'default', position: { x: 480, y: 240 }, data: { label: 'Worker B\n(processing list)' } },
          { id: 'dlq', type: 'default', position: { x: 710, y: 240 }, data: { label: 'Dead Letter Queue' } },
        ],
        edges: [
          { id: 'qe1', source: 'q1', target: 'q2' },
          { id: 'qe2', source: 'q2', target: 'w1' },
          { id: 'qe3', source: 'q2', target: 'w2' },
          { id: 'qe4', source: 'w1', target: 'dlq', label: 'retries exhausted' },
        ],
      },
      {
        project: projects[4]._id, title: 'Deployment Reconciliation Flow', description: 'How the CLI converges declared vs actual cloud state.',
        nodes: [
          { id: 'd1', type: 'input', position: { x: 40, y: 130 }, data: { label: 'deploy.yaml\n(manifest)' } },
          { id: 'd2', type: 'default', position: { x: 260, y: 130 }, data: { label: 'State Reconciler' } },
          { id: 'd3', position: { x: 480, y: 40 }, data: { label: 'CloudFormation\nTemplate Gen' } },
          { id: 'd4', position: { x: 480, y: 230 }, data: { label: 'Secrets Manager\nRead' } },
          { id: 'd5', type: 'output', position: { x: 700, y: 130 }, data: { label: 'ECS Task Revision' } },
        ],
        edges: [
          { id: 'de1', source: 'd1', target: 'd2' },
          { id: 'de2', source: 'd2', target: 'd3' },
          { id: 'de3', source: 'd2', target: 'd4' },
          { id: 'de4', source: 'd3', target: 'd5' },
          { id: 'de5', source: 'd4', target: 'd5', label: 'inject env' },
        ],
      },
    ]);

    await DatabaseSchema.insertMany([
      {
        project: projects[0]._id, name: 'Primary Document Store', description: 'MongoDB collections for parsed documents and cached analyses.',
        collections: [
          { name: 'documents', fields: [
            { name: '_id', type: 'ObjectId' },
            { name: 'user', type: 'ObjectId (ref User)', required: true },
            { name: 'originalName', type: 'String' },
            { name: 'contentHash', type: 'String', indexed: true },
            { name: 'normalisedText', type: 'String' },
            { name: 'jobDescription', type: 'String' },
            { name: 'analysis', type: 'Object' },
            { name: 'createdAt', type: 'Date' },
          ]},
          { name: 'analyses', fields: [
            { name: '_id', type: 'ObjectId' },
            { name: 'contentHash', type: 'String', indexed: true, unique: true },
            { name: 'score', type: 'Number' },
            { name: 'result', type: 'Object' },
          ]},
        ],
        relationships: [
          { from: 'documents.user', to: 'users._id', type: 'reference' },
        ],
      },
      {
        project: projects[1]._id, name: 'Financial Ledger', description: 'PostgreSQL schema for transactions, budgets, and categories.',
        collections: [
          { name: 'transactions', fields: [
            { name: 'id', type: 'UUID' },
            { name: 'user_id', type: 'UUID (FK users)', required: true },
            { name: 'amount_original', type: 'NUMERIC(14,2)', required: true },
            { name: 'currency_original', type: 'CHAR(3)', required: true },
            { name: 'amount_base', type: 'NUMERIC(14,2)', required: true },
            { name: 'exchange_rate', type: 'NUMERIC(16,8)' },
            { name: 'category_id', type: 'UUID (FK categories)' },
            { name: 'merchant', type: 'VARCHAR(255)' },
            { name: 'occurred_at', type: 'TIMESTAMPTZ' },
          ]},
          { name: 'budgets', fields: [
            { name: 'id', type: 'UUID' },
            { name: 'user_id', type: 'UUID (FK users)' },
            { name: 'category_id', type: 'UUID (FK categories)' },
            { name: 'amount_limit', type: 'NUMERIC(14,2)' },
            { name: 'period', type: 'VARCHAR(7)' },
          ]},
          { name: 'categories', fields: [
            { name: 'id', type: 'UUID' },
            { name: 'user_id', type: 'UUID (FK users)' },
            { name: 'name', type: 'VARCHAR(100)' },
            { name: 'keywords', type: 'TEXT[]' },
          ]},
        ],
        relationships: [
          { from: 'transactions.user_id', to: 'users.id', type: 'foreign key' },
          { from: 'transactions.category_id', to: 'categories.id', type: 'foreign key' },
          { from: 'budgets.category_id', to: 'categories.id', type: 'foreign key' },
        ],
      },
      {
        project: projects[3]._id, name: 'Queue Storage Layout', description: 'Redis keys used for pending, processing, and dead letter queues.',
        collections: [
          { name: 'queue:{name}:pending', fields: [
            { name: 'type', type: 'Redis List' },
            { name: 'payload', type: 'JSON string' },
            { name: 'priority', type: 'encoded in payload' },
          ]},
          { name: 'queue:{name}:processing:{workerId}', fields: [
            { name: 'type', type: 'Redis List' },
            { name: 'purpose', type: 'recoverable in-progress jobs' },
          ]},
          { name: 'queue:{name}:dead', fields: [
            { name: 'type', type: 'Redis Sorted Set' },
            { name: 'score', type: 'failure timestamp' },
          ]},
        ],
        relationships: [
          { from: 'processing lists', to: 'pending list', type: 'recovery on worker crash' },
        ],
      },
    ]);

    await ApiEndpoint.insertMany([
      { project: projects[0]._id, method: 'POST', endpoint: '/api/v1/analyze', description: 'Submit a resume and job description for AI analysis.', authentication: true, order: 1,
        parameters: [], statusCodes: [200, 400, 401, 422],
        requestBody: { resumeUrl: 'string', jobDescription: 'string' },
        responseBody: { score: 'number', strengths: 'string[]', gaps: 'string[]', suggestions: 'string[]' },
        exampleRequest: `curl -X POST /api/v1/analyze -H "Authorization: Bearer <token>" -H "Content-Type: application/json" -d '{"resumeUrl":"https://...","jobDescription":"Backend Engineer"}'`,
        exampleResponse: `{"success":true,"data":{"score":82,"strengths":["Clear impact metrics"],"gaps":["No Kubernetes experience"],"suggestions":["Quantify the migration project"]}}` },
      { project: projects[0]._id, method: 'GET', endpoint: '/api/v1/analyze/:id', description: 'Fetch a previously computed analysis.', authentication: true, order: 2,
        parameters: [{ name: 'id', in: 'path', type: 'string', required: true, description: 'Document ID' }],
        statusCodes: [200, 401, 404], requestBody: null, responseBody: { id: 'string', score: 'number' },
        exampleRequest: `curl /api/v1/analyze/65f1... -H "Authorization: Bearer <token>"`,
        exampleResponse: `{"success":true,"data":{"id":"65f1...","score":82}}` },
      { project: projects[1]._id, method: 'GET', endpoint: '/api/v1/transactions', description: 'List transactions with optional date and category filters.', authentication: true, order: 1,
        parameters: [
          { name: 'from', in: 'query', type: 'string', required: false, description: 'ISO date' },
          { name: 'to', in: 'query', type: 'string', required: false, description: 'ISO date' },
          { name: 'categoryId', in: 'query', type: 'string', required: false, description: 'Category filter' },
        ],
        statusCodes: [200, 401], requestBody: null, responseBody: { transactions: 'Transaction[]', total: 'number' },
        exampleRequest: `curl "/api/v1/transactions?from=2025-09-01&to=2025-09-30" -H "Authorization: Bearer <token>"`,
        exampleResponse: `{"success":true,"data":{"transactions":[{"id":"...","amount":42.5,"currency":"USD","merchant":"Coffee Co"}],"total":128}}` },
      { project: projects[1]._id, method: 'POST', endpoint: '/api/v1/budgets', description: 'Create a budget for a category over a period.', authentication: true, order: 2,
        parameters: [], statusCodes: [201, 400, 401],
        requestBody: { categoryId: 'string', amountLimit: 'number', period: 'string' },
        responseBody: { id: 'string', amountLimit: 'number' },
        exampleRequest: `curl -X POST /api/v1/budgets -H "Authorization: Bearer <token>" -d '{"categoryId":"...","amountLimit":500,"period":"2025-10"}'`,
        exampleResponse: `{"success":true,"data":{"id":"b1","amountLimit":500}}` },
      { project: projects[2]._id, method: 'POST', endpoint: '/api/v1/documents', description: 'Upload a document to the knowledge base.', authentication: true, order: 1,
        parameters: [], statusCodes: [201, 401, 413],
        requestBody: { filename: 'string', contentType: 'string' },
        responseBody: { id: 'string', chunks: 'number' },
        exampleRequest: `curl -X POST /api/v1/documents -H "Authorization: Bearer <token>" -F "file=@spec.pdf"`,
        exampleResponse: `{"success":true,"data":{"id":"d9","chunks":42}}` },
      { project: projects[2]._id, method: 'POST', endpoint: '/api/v1/query', description: 'Ask a question against the knowledge base.', authentication: true, order: 2,
        parameters: [], statusCodes: [200, 401, 422],
        requestBody: { question: 'string' },
        responseBody: { answer: 'string', citations: 'Citation[]', confident: 'boolean' },
        exampleRequest: `curl -X POST /api/v1/query -H "Authorization: Bearer <token>" -d '{"question":"What is the retry limit?"}'`,
        exampleResponse: `{"success":true,"data":{"answer":"Retries cap at 5 attempts with exponential backoff.","citations":[{"document":"ops.md","chunk":7}],"confident":true}}` },
      { project: projects[3]._id, method: 'POST', endpoint: '/api/v1/jobs', description: 'Enqueue a job with optional priority.', authentication: true, order: 1,
        parameters: [], statusCodes: [202, 400, 401],
        requestBody: { queue: 'string', payload: 'object', priority: 'number' },
        responseBody: { jobId: 'string' },
        exampleRequest: `curl -X POST /api/v1/jobs -d '{"queue":"emails","payload":{"to":"a@b.c"},"priority":1}'`,
        exampleResponse: `{"success":true,"data":{"jobId":"j-8812"}}` },
      { project: projects[3]._id, method: 'GET', endpoint: '/api/v1/queues', description: 'Queue depth and throughput metrics.', authentication: true, order: 2,
        parameters: [], statusCodes: [200, 401], requestBody: null,
        responseBody: { queues: '{name:string,pending:number,processing:number,dead:number}[]' },
        exampleRequest: `curl /api/v1/queues -H "Authorization: Bearer <token>"`,
        exampleResponse: `{"success":true,"data":{"queues":[{"name":"emails","pending":12,"processing":3,"dead":0}]}}` },
    ]);

    await EngineeringDecision.insertMany([
      { project: projects[0]._id, title: 'MongoDB vs PostgreSQL', problem: 'The project required flexible project documentation structures.', context: 'Documents contain deeply nested and variable-shaped fields that change as features ship.', options: ['MongoDB', 'PostgreSQL'], selectedSolution: 'MongoDB', reason: 'Project documentation contains highly variable nested structures that map cleanly to documents without a migration per feature.', tradeoffs: 'We give up relational integrity guarantees and cross-document transactions.', consequences: 'Referential integrity is enforced in application code, so every write path needs to check the referenced document exists.', status: 'accepted', date: new Date('2025-10-01') },
      { project: projects[0]._id, title: 'OpenAI GPT-4 vs Local LLM', problem: 'Need to decide on AI model for resume analysis.', context: 'Accuracy matters more than unit cost, but the feature runs on every submission.', options: ['OpenAI GPT-4', 'Local LLM (Llama)', 'Claude API'], selectedSolution: 'OpenAI GPT-4', reason: 'Best accuracy for document analysis with minimal setup, and structured JSON output is reliable enough to avoid a parsing layer.', tradeoffs: 'API costs and latency vs self-hosted. We accepted per-request cost in exchange for accuracy.', consequences: 'Added content-hash caching so repeat submissions cost nothing.', status: 'accepted', date: new Date('2025-10-15') },
      { project: projects[1]._id, title: 'PostgreSQL for money', problem: 'Choosing a datastore for financial transaction data.', context: 'Amounts, exchange rates, and budgets need exact arithmetic and must never drift.', options: ['PostgreSQL', 'MongoDB', 'SQLite'], selectedSolution: 'PostgreSQL', reason: 'NUMERIC gives exact decimal arithmetic. Floating point on currency is a correctness bug waiting to happen.', tradeoffs: 'Fixed schema means migrations when adding transaction types.', consequences: 'Amounts are never stored as float anywhere in the pipeline.', status: 'accepted', date: new Date('2025-09-10') },
      { project: projects[1]._id, title: 'Rolling window vs fixed period budgets', problem: 'How should budget limits be evaluated over time?', context: 'Users set a monthly limit but expenses arrive unevenly across the month.', options: ['Fixed calendar month', 'Rolling 30-day window', 'Both'], selectedSolution: 'Both', reason: 'Calendar view matches how people think about a month; rolling window gives a truthful pace. Offering only one surprised users either way.', tradeoffs: 'Two projections to maintain and explain in the UI.', consequences: 'Alert logic duplicated per mode but they share one underlying spend query.', status: 'accepted', date: new Date('2025-09-25') },
      { project: projects[2]._id, title: 'Vector Database Selection', problem: 'Need efficient semantic search across documents.', context: 'Around 50k chunks across internal docs, with growth expected to be fast.', options: ['Pinecone', 'MongoDB Atlas Vector Search', 'pgvector'], selectedSolution: 'MongoDB Atlas Vector Search', reason: 'Already using MongoDB for document storage, so keeping embeddings beside the source documents removes a whole sync layer.', tradeoffs: 'Less mature than dedicated vector databases and fewer tuning knobs for index parameters.', consequences: 'Acceptable because recall is carried by hybrid BM25 search rather than pure vector recall.', status: 'accepted', date: new Date('2026-01-05') },
      { project: projects[2]._id, title: 'Hybrid dense + BM25 retrieval', problem: 'Pure vector search missed queries containing specific identifiers.', context: 'Users search for exact things like error codes and table names, which embed poorly.', options: ['Dense only', 'BM25 only', 'Hybrid with score fusion'], selectedSolution: 'Hybrid with score fusion', reason: 'Dense retrieval handles paraphrase, BM25 handles exact identifiers. Fusing the scores measurably improved recall on real queries.', tradeoffs: 'Two indexes to keep in sync and score normalisation is fiddly.', consequences: 'Added an offline eval set so retrieval changes are measured, not guessed.', status: 'accepted', date: new Date('2026-01-12') },
      { project: projects[3]._id, title: 'At-least-once vs exactly-once delivery', problem: 'What delivery guarantee should the queue advertise?', context: 'Handlers write to a separate Postgres datastore, so a distributed transaction would be required for true exactly-once.', options: ['At-least-once', 'Exactly-once', 'At-most-once'], selectedSolution: 'At-least-once', reason: 'Exactly-once across the queue and a consumer datastore needs distributed transactions, which would cost far more than the duplicate-work problem it solves.', tradeoffs: 'Consumers must be idempotent, so the guarantee is only useful if they are written that way.', consequences: 'Documentation pushes idempotency onto the consumer explicitly rather than hiding the tradeoff.', status: 'accepted', date: new Date('2025-07-20') },
      { project: projects[3]._id, title: 'BRPOPLPUSH vs polling with Lua', problem: 'Choosing the core queue primitive.', context: 'Needed reliable hand-off so a crashed worker does not lose a job.', options: ['BRPOPLPUSH', 'Polling with Lua scripts', 'Streams'], selectedSolution: 'BRPOPLPUSH', reason: 'Atomic move from pending to the processing list in a single call, which is exactly the hand-off guarantee we needed without extra round trips.', tradeoffs: 'Recovering abandoned jobs needs a reaper scanning processing lists, which is extra machinery to operate.', consequences: 'Wrote a reaper that re-queues jobs whose heartbeat expired.', status: 'accepted', date: new Date('2025-08-01') },
      { project: projects[4]._id, title: 'Reconcile vs imperative deploys', problem: 'How should the CLI apply a deploy?', context: 'Users re-run deploys when things fail, often in a partial state.', options: ['Imperative (execute steps)', 'Declarative reconciliation', 'Hybrid'], selectedSolution: 'Declarative reconciliation', reason: 'Re-running an imperative deploy after a partial failure produces duplicate resources. Reconciling declared against actual state converges instead.', tradeoffs: 'Slower for trivial changes and requires a real state-diff model.', consequences: 'Every resource needs a stable identifier for the diff to be meaningful.', status: 'accepted', date: new Date('2025-08-28') },
      { project: projects[4]._id, title: 'Secrets on disk vs Secrets Manager', problem: 'How should the CLI provide credentials to deployed services.', context: 'Needed production secrets available at deploy time without a developer handling them.', options: ['.env file on disk', 'AWS Secrets Manager', 'SSM Parameter Store'], selectedSolution: 'AWS Secrets Manager', reason: 'Secrets are fetched at deploy time and injected into the running task, so no credential is ever written to a developer machine.', tradeoffs: 'Adds a runtime dependency on AWS and a small latency cost per deploy.', consequences: 'Debugging deploys requires access to Secrets Manager rather than reading a local file.', status: 'accepted', date: new Date('2025-09-15') },
      { project: projects[5]._id, title: 'CSS custom properties vs JS theming', problem: 'How should themes and dark mode be applied?', context: 'Needed runtime theme switching and RTL without consumers rebuilding components.', options: ['CSS custom properties', 'JS theme objects', 'CSS-in-JS'], selectedSolution: 'CSS custom properties', reason: 'Themes resolve in the cascade with no React re-render, so switching themes is nearly free and avoids a flash of unstyled content.', tradeoffs: 'Token values are strings, so computed logic cannot live in the token layer.', consequences: 'Derived values are computed in JS and fed back in as tokens.', status: 'accepted', date: new Date('2025-06-05') },
      { project: projects[5]._id, title: 'Accessibility as release gate vs backlog', problem: 'When should accessibility work be done?', context: 'Fixing keyboard traps after components ship is far more expensive than preventing them.', options: ['Backlog items', 'Release gate in CI', 'Design review only'], selectedSolution: 'Release gate in CI', reason: 'A component that cannot be published until keyboard and axe-core tests pass prevents the regressions that pile up when a11y is deferred.', tradeoffs: 'Slower to ship components that are visually done.', consequences: 'Focus management became the bulk of the effort, particularly for combobox and menu.', status: 'accepted', date: new Date('2025-06-18') },
    ]);

    await Problem.insertMany([
      { project: projects[0]._id, title: 'PDF parsing accuracy', description: 'Resume PDFs had inconsistent formatting causing parsing errors.', symptoms: 'Missing sections, garbled text extraction, text reading in the wrong order on two-column layouts.', rootCause: 'The PDF library was not handling multi-column layouts, so it flattened content in raw stream order.', investigation: 'Tested pdf-parse, pdf2json, and PyPDF2 against a corpus of 200 real resumes and measured section-order accuracy for each.', failedApproaches: ['pdf2json - poor multi-column support, dropped 30% of two-column content', 'Increasing buffer size - treated the symptom, parsing order stayed wrong'], finalSolution: 'Switched to pdf-parse and added a post-processing pass that detects column boundaries from x-coordinates before linearising text.', result: 'Parsing accuracy went from 71% to 99% on the 200-resume corpus.', lessonsLearned: 'Always test parsers against real-world documents. Synthetic fixtures hide exactly the layout variation that breaks them.' },
      { project: projects[1]._id, title: 'Duplicate transactions on Plaid webhook retries', description: 'The same transaction appeared two or three times in the ledger.', symptoms: 'Totals inflated, sometimes by 20-30% on days with heavy webhook traffic.', rootCause: 'Plaid retries webhooks when our acknowledgement is slow, and we had no idempotency key, so each retry inserted a new row.', investigation: 'Correlated duplicate rows against webhook delivery logs and found the same plaid_transaction_id arriving 2-3 times within seconds.', failedApproaches: ['Debouncing in the API layer - only reduced duplicates, did not eliminate them because retries were minutes apart', 'Checking for a recent identical amount - wrong approach, a user can genuinely have two identical purchases'], finalSolution: 'Added a unique constraint on (user_id, plaid_transaction_id) and made the insert an upsert that no-ops on conflict.', result: 'Duplicates eliminated. The constraint also turned a silent data-corruption bug into a loud, safe no-op.', lessonsLearned: 'Any endpoint that can be retried needs an idempotency key enforced by the database, not by application logic that can be bypassed.' },
      { project: projects[1]._id, title: 'Budget alerts firing too late', description: 'Users received budget notifications only after they had already overspent.', symptoms: 'Alerts arrived at month end when the damage was done, and users complained the feature was useless.', rootCause: 'Alerts were evaluated against final spend at period close, so the warning carried no information the user did not already have.', investigation: 'Read alert logs and found the evaluation ran as a nightly job that compared actual spend to the limit.', failedApproaches: ['More frequent evaluation - the same end-of-period comparison still had nothing useful to say mid-month'], finalSolution: 'Changed the alert to compare projected spend (pace so far, extrapolated to period end) against the limit, and fire when projection crosses it.', result: 'Alerts now arrive around 60% through the month, early enough for a user to act on.', lessonsLearned: 'A notification that arrives after the decision it was meant to inform is not a notification. Ask what the user can still do when they receive it.' },
      { project: projects[2]._id, title: 'Slow document indexing', description: 'Indexing large document collections took too long.', symptoms: 'API timeouts on documents longer than 100 pages.', rootCause: 'The entire document was parsed, chunked, and embedded in a single synchronous request with no concurrency.', investigation: 'Profiled the indexing pipeline and found embedding calls accounted for most of the wall time, issued strictly one after another.', failedApproaches: ['Batching - still serial, batches just grouped the calls without parallelising them', 'Raising the request timeout - hid the problem and made users wait longer for a result that was equally slow'], finalSolution: 'Moved indexing to background workers with bounded concurrency (16 in-flight embedding calls) and chunked processing so memory stayed flat regardless of document size.', result: 'A 100-page document went from timing out to indexing in 12 seconds, roughly a 10x improvement.', lessonsLearned: 'Parallelise IO-bound work early. Serial network calls are the most common source of easy performance wins.' },
      { project: projects[2]._id, title: 'Retrieval missing exact-match queries', description: 'Questions containing specific identifiers returned vague answers.', symptoms: 'Searching for an error code or table name returned topically similar but wrong chunks.', rootCause: 'Pure dense vector retrieval embeds identifiers poorly. "ERR_CONN_001" and "ERR_CONN_002" are nearly identical as vectors despite meaning different things.', investigation: 'Ran a labelled set of 150 identifier-heavy queries and measured recall, then compared against BM25 alone to isolate the cause.', failedApproaches: ['Larger embedding model - recall moved 4%, nowhere near enough, because the model is the wrong tool for exact matching', 'Lowering the similarity threshold - flooded results with worse chunks, trading precision for a recall gain that never arrived'], finalSolution: 'Implemented hybrid retrieval fusing dense vector scores with BM25 keyword scores, with BM25 weighted higher when the query contains identifier-like tokens.', result: 'Recall on identifier queries went from 61% to 94% with no measurable precision loss on natural-language queries.', lessonsLearned: 'Vector search is not a replacement for keyword search. Most real workloads need both, and the right move is to fuse rather than choose.' },
      { project: projects[3]._id, title: 'Jobs lost when workers crashed', description: 'Jobs disappeared whenever a worker was killed mid-processing.', symptoms: 'In-flight jobs vanished with no record, and throughput dropped after every deploy.', rootCause: 'Workers used plain BRPOP, which removes the job from Redis the instant it is popped. A crash after that point destroyed the job with no way to recover it.', investigation: 'Reproduced by SIGKILLing a worker mid-job and confirming the job was gone from Redis entirely.', failedApproaches: ['Wrapping the handler in a try/finally - cannot help, the process is already dead', 'Shorter visibility timeouts on BRPOP - made the loss window shorter but did not remove it'], finalSolution: 'Switched to BRPOPLPUSH so a job moves atomically from the pending list to a per-worker processing list, plus a reaper that re-queues processing jobs whose heartbeat expired.', result: 'No job loss across a week of deploys that deliberately SIGKILL workers. Recovery is automatic within one reaper interval.', lessonsLearned: 'Destructive queue operations destroy data the moment they run. The hand-off should be a move, not a delete followed by an insert.' },
      { project: projects[3]._id, title: 'Retry storms after an outage', description: 'When Redis recovered, every failed job retried simultaneously.', symptoms: 'Recovery from a brief Redis blip caused a latency spike far worse than the original outage, and some jobs exhausted their retries without succeeding.', rootCause: 'Exponential backoff had no jitter, so every job that failed at the same moment computed the same next attempt time and retried in lockstep.', investigation: 'Plotted retry attempt timestamps during a test outage and observed tight clustering rather than the expected spread.', failedApproaches: ['Increasing the base backoff - shifted the storm later without spreading it'], finalSolution: 'Added full jitter, randomising each delay across the whole backoff window instead of applying a fixed exponential curve.', result: 'Retry traffic spread evenly across the window. Jobs that failed for transient reasons now succeed instead of burning their attempts in a thundering herd.', lessonsLearned: 'Exponential backoff without jitter is not backoff, it is a synchronised stampede with extra steps.' },
      { project: projects[4]._id, title: 'Deploys duplicating resources', description: 'Re-running a failed deploy created duplicate cloud resources.', symptoms: 'Deploys produced orphaned load balancers and security groups that nothing referenced.', rootCause: 'The CLI executed steps imperatively. A failure halfway through left state that a re-run interpreted as "not yet created" and created again.', investigation: 'Reproduced by failing a deploy at step 3, then re-running and diffing the resource list before and after.', failedApproaches: ['Manual cleanup between attempts - not viable for users beyond a single developer', 'Recording completed steps in local state - broke whenever the deploy ran from a different machine or in CI'], finalSolution: 'Rewrote the CLI to reconcile declared manifest state against actual cloud state, generating stable logical IDs so a re-run converges instead of duplicating.', result: 'Re-running a partially failed deploy converges to the intended state. Orphans dropped to zero.', lessonsLearned: 'Anything a user may re-run after a failure must be convergent. Imperative steps are only safe if they are perfectly idempotent, which is a strong assumption to rely on.' },
      { project: projects[4]._id, title: 'First deploy run took 11 minutes', description: 'The initial deploy was slow enough that users assumed it had hung.', symptoms: 'First deploy sat at "provisioning" for most of 11 minutes with no progress output.', rootCause: 'The CLI provisioned infrastructure serially and independently, so every resource waited on the previous one even though most had no real dependency.', investigation: 'Instrumented each step and found only about a minute of work was actually dependent; the rest was serialisation.', failedApproaches: ['Printing spinner output - improved the perceived experience but the underlying time was unchanged', 'Removing the safety prompts - saved seconds, not minutes'], finalSolution: 'Modelled explicit dependencies between resources and provisioned independent ones in parallel, with a topological sort to respect real ordering.', result: 'First deploy dropped to under 90 seconds, with honest per-resource progress.', lessonsLearned: 'Perceived performance is partly a logging problem and partly a real concurrency problem. Check which one you have before optimising.' },
      { project: projects[5]._id, title: 'Focus trap in nested modals', description: 'A confirmation dialog opened from inside a dialog stole focus permanently.', symptoms: 'Keyboard users were trapped in the confirmation dialog and could not return to the parent dialog.', rootCause: 'Each modal mounted its own focus trap independently, and both reacted to the same focus events, so restoring focus on close handed it to the wrong trap.', investigation: 'Reproduced with a keyboard-only test, then traced focus events and found two active traps responding to the same Tab keypress.', failedApproaches: ['A single global trap manager - worked but coupled every modal to a shared module, making them non-reusable in isolation', 'Disabling the parent trap while a child is open - fixed the symptom but the parent still restored focus on its own close path'], finalSolution: 'Introduced a focus stack where opening pushes a scope and closing pops it, so only the topmost scope is active and focus returns to the element that opened the child.', result: 'Nested dialogs now behave correctly and the fix generalised to menus and popovers, which use the same stack.', lessonsLearned: 'Global state is the right answer when interactions genuinely nest. Modals, menus, and popovers are one system, not three independent components.' },
    ]);

    await TimelineEvent.insertMany([
      { project: projects[0]._id, title: 'Project Started', description: 'Initial concept and architecture design', date: new Date('2025-09-01'), githubRef: 'initial commit' },
      { project: projects[0]._id, title: 'MVP Completed', description: 'Basic resume parsing and AI analysis working', date: new Date('2025-10-15') },
      { project: projects[0]._id, title: 'Production Launch', description: 'Deployed to AWS with full monitoring', date: new Date('2025-11-15') },
      { project: projects[0]._id, title: 'Caching Added', description: 'Content-hash caching introduced, cutting AI API costs by 70%', date: new Date('2025-12-08') },
      { project: projects[1]._id, title: 'Project Started', description: 'Ledger schema and Plaid integration kicked off', date: new Date('2025-08-18') },
      { project: projects[1]._id, title: 'MVP Launched', description: 'Transaction import and basic reporting live for internal users', date: new Date('2025-09-28') },
      { project: projects[1]._id, title: 'Multi-Currency Support', description: 'Base currency normalisation added for historical stability', date: new Date('2025-10-20') },
      { project: projects[1]._id, title: 'Production Launch', description: 'Public launch with budget alerts', date: new Date('2025-11-02') },
      { project: projects[2]._id, title: 'Project Started', description: 'RAG architecture research', date: new Date('2025-12-01') },
      { project: projects[2]._id, title: 'Vector Search Working', description: 'MongoDB Atlas vector search integration complete', date: new Date('2026-01-10') },
      { project: projects[2]._id, title: 'Hybrid Retrieval', description: 'BM25 fusion shipped after measuring recall on identifier queries', date: new Date('2026-01-18') },
      { project: projects[2]._id, title: 'Beta Launch', description: 'Public beta with document upload and cited answers', date: new Date('2026-01-20') },
      { project: projects[3]._id, title: 'Project Started', description: 'Core queue and worker design', date: new Date('2025-06-15') },
      { project: projects[3]._id, title: 'Reliable Hand-off', description: 'Switched to BRPOPLPUSH after reproducing job loss under SIGKILL', date: new Date('2025-07-22') },
      { project: projects[3]._id, title: 'v1.0 Release', description: 'Priorities, retries, and dead letter queue complete', date: new Date('2025-08-10') },
      { project: projects[3]._id, title: 'Backoff Jitter Added', description: 'Full jitter shipped to eliminate retry storms', date: new Date('2025-09-12') },
      { project: projects[4]._id, title: 'Project Started', description: 'CLI scaffolding and manifest schema', date: new Date('2025-08-05') },
      { project: projects[4]._id, title: 'Reconciliation Engine', description: 'Declarative state diff replaced imperative steps', date: new Date('2025-08-28') },
      { project: projects[4]._id, title: 'Rollback Support', description: 'Task definition revisions recorded for one-command rollback', date: new Date('2025-09-20') },
      { project: projects[4]._id, title: 'v1.0 Release', description: 'Parallel provisioning brought first deploy under 90 seconds', date: new Date('2025-10-05') },
      { project: projects[5]._id, title: 'Project Started', description: 'Token architecture and theming groundwork', date: new Date('2025-05-10') },
      { project: projects[5]._id, title: 'First Components', description: 'Button, Input, and Select shipped with a11y tests', date: new Date('2025-05-28') },
      { project: projects[5]._id, title: 'v1.0 Release', description: 'Twenty accessible components with Storybook docs', date: new Date('2025-06-20') },
      { project: projects[5]._id, title: 'Focus Stack', description: 'Nested modal focus management generalised to menus and popovers', date: new Date('2025-08-14') },
    ]);

    await Deployment.insertMany([
      { project: projects[0]._id, cloudProvider: 'AWS', frontendHosting: 'S3 + CloudFront', backendHosting: 'AWS ECS Fargate', databaseHosting: 'MongoDB Atlas', objectStorage: 'AWS S3', cdn: 'CloudFront', cicd: 'GitHub Actions', docker: 'Docker Compose', domain: 'resume-analyzer.example.com', environmentConfig: 'Secrets in AWS Secrets Manager, injected as ECS task environment variables. Twelve-factor style, no config baked into images.' },
      { project: projects[1]._id, cloudProvider: 'AWS', frontendHosting: 'S3 + CloudFront', backendHosting: 'AWS ECS Fargate', databaseHosting: 'Amazon RDS for PostgreSQL', objectStorage: 'AWS S3', cdn: 'CloudFront', cicd: 'GitHub Actions', docker: 'Docker Compose', domain: 'expenses.example.com', environmentConfig: 'Plaid credentials and database URL from Secrets Manager. Migrations run as a deploy step before traffic shifts.' },
      { project: projects[2]._id, cloudProvider: 'AWS', frontendHosting: 'AWS Amplify', backendHosting: 'AWS ECS Fargate', databaseHosting: 'MongoDB Atlas with Vector Search', objectStorage: 'AWS S3', cdn: 'CloudFront', cicd: 'GitHub Actions', docker: 'Docker Compose', domain: 'knowledge-agent.example.com', environmentConfig: 'OpenAI API key and database credentials in Secrets Manager. Indexing workers run as a separate ECS service with bounded concurrency.' },
      { project: projects[3]._id, cloudProvider: 'Self-hosted', backendHosting: 'Go binary on Kubernetes', databaseHosting: 'Redis 7 cluster (3 masters, 3 replicas)', objectStorage: 'N/A', cdn: 'N/A', cicd: 'GitHub Actions + ArgoCD', docker: 'Docker multi-stage builds', domain: 'taskqueue.example.com', environmentConfig: 'Redis connection via cluster-aware client. TLS between workers and Redis, mandatory ACL user rather than the default account.' },
      { project: projects[4]._id, cloudProvider: 'AWS', frontendHosting: 'N/A (CLI distributed via npm)', backendHosting: 'Targets AWS ECS Fargate', databaseHosting: 'Managed by target project', objectStorage: 'AWS S3 for build artefacts', cdn: 'N/A', cicd: 'GitHub Actions (self-dogfooding)', docker: 'Docker multi-stage builds', domain: 'cloud-deploy.example.com', environmentConfig: 'The CLI itself holds no long-lived credentials. It uses the deployer AWS profile or an assumed role scoped to the target account.' },
      { project: projects[5]._id, cloudProvider: 'Vercel', frontendHosting: 'Vercel (Storybook)', backendHosting: 'GitHub Pages (docs)', objectStorage: 'npm registry', cdn: 'Vercel Edge Network', cicd: 'GitHub Actions with semantic-release', docker: 'N/A', domain: 'components.example.com', environmentConfig: 'Fully static. No server runtime, which is deliberate so the library works in any consumer environment.' },
    ]);

    await Lesson.insertMany([
      { project: projects[0]._id, title: 'Test with real data early', content: 'Always test AI models and parsers with real-world data, not just synthetic test cases. The multi-column PDF failure only appeared with actual resumes from real applicants.', category: 'technical' },
      { project: projects[0]._id, title: 'Cache expensive calls by content hash', content: 'OpenAI API calls are expensive. Hashing the normalised input and caching by that hash made repeat submissions free and dropped our AI spend by 70%.', category: 'performance' },
      { project: projects[0]._id, title: 'Enforce idempotency in the database', content: 'Application-level "check then insert" will eventually race. A unique constraint turned a silent data-corruption bug into a safe no-op.', category: 'architecture' },
      { project: projects[1]._id, title: 'Never use floats for money', content: 'Use NUMERIC or integer minor units. Floating point on currency is a correctness bug that surfaces during reconciliation, usually at the worst time.', category: 'technical' },
      { project: projects[1]._id, title: 'Alerts must arrive before the decision', content: 'A notification that lands after the user already overspent is noise, not a feature. Alert on projected pace, not final totals.', category: 'product' },
      { project: projects[1]._id, title: 'Store the rate at transaction time', content: 'Converting historical transactions using today\'s exchange rate makes past reports silently change. Persist the rate you used.', category: 'architecture' },
      { project: projects[2]._id, title: 'Chunking strategy matters', content: 'Document chunking strategy significantly affects retrieval quality. Semantic boundaries beat fixed token windows, and the difference was visible in citation accuracy.', category: 'architecture' },
      { project: projects[2]._id, title: 'Hybrid search beats vector-only', content: 'Dense retrieval handles paraphrase; keyword search handles exact identifiers. Fusing the two fixed a recall problem no amount of model tuning solved.', category: 'technical' },
      { project: projects[2]._id, title: 'Measure retrieval, do not eyeball it', content: 'Build a labelled eval set before changing retrieval. Without it, every change is a guess dressed up as an improvement.', category: 'development' },
      { project: projects[3]._id, title: 'Make queue hand-offs a move, not a delete', content: 'Destructive pops destroy data the instant they run. Use an atomic move to a processing list so a crash is recoverable.', category: 'architecture' },
      { project: projects[3]._id, title: 'Backoff without jitter is a stampede', content: 'Exponential backoff with identical inputs produces identical retry times. Add full jitter or you have synchronised retries wearing a delay as a disguise.', category: 'technical' },
      { project: projects[3]._id, title: 'Be honest about delivery guarantees', content: 'At-least-once is only useful if consumers know to be idempotent. Document the requirement instead of implying exactly-once you do not provide.', category: 'product' },
      { project: projects[4]._id, title: 'Anything re-runnable must converge', content: 'Users retry failed deploys. Imperative steps duplicate resources; declarative reconciliation makes a retry safe by construction.', category: 'architecture' },
      { project: projects[4]._id, title: 'Model dependencies explicitly', content: 'Most infrastructure resources do not depend on each other. Serialising them turned 90 seconds of work into 11 minutes of waiting.', category: 'performance' },
      { project: projects[4]._id, title: 'Never put production secrets on disk', content: 'Read from Secrets Manager at deploy time and inject into the running task. A credential on a laptop is a credential you have lost control of.', category: 'security' },
      { project: projects[5]._id, title: 'Accessibility as a release gate', content: 'Preventing keyboard traps in CI is far cheaper than retrofitting them. A component that fails a11y tests simply does not publish.', category: 'development' },
      { project: projects[5]._id, title: 'Do not reimplement focus management', content: 'Following the WAI-ARIA authoring practices beat pattern-matching other libraries. Nested focus needs a stack, not N independent traps.', category: 'technical' },
      { project: projects[5]._id, title: 'Design tokens should not re-render', content: 'CSS custom properties switch themes with no React work and no flash of unstyled content, which JS theme objects cannot avoid cleanly.', category: 'performance' },
      { project: projects[5]._id, title: 'Mistake we made', content: 'We shipped a combobox that passed axe-core but was unusable by keyboard, because our tests checked for violations rather than for actual operability. Automated a11y checks find violations, not broken interactions.', category: 'mistake' },
    ]);

    await Comment.insertMany([
      { user: users[1]._id, project: projects[0]._id, content: 'Great project! How do you handle different resume formats?' },
      { user: users[2]._id, project: projects[0]._id, content: 'The AI analysis is impressively accurate.' },
      { user: users[0]._id, project: projects[2]._id, content: 'Love the RAG approach. What embedding model are you using?' },
      { user: users[3]._id, project: projects[3]._id, content: 'The BRPOPLPUSH hand-off is the right call. Most queues I have used lose jobs on worker crashes.' },
      { user: users[1]._id, project: projects[3]._id, content: 'Good point on documenting at-least-once. Too many queue libraries quietly imply exactly-once.' },
      { user: users[2]._id, project: projects[4]._id, content: 'Reconciliation instead of imperative steps. This is the right default for anything users will retry.' },
      { user: users[0]._id, project: projects[5]._id, content: 'The focus stack write-up saved me a day. Nested modals are genuinely hard.' },
      { user: users[3]._id, project: projects[5]._id, content: 'Appreciate the honesty in the axe-core lesson. That is a mistake most teams only discover after users complain.' },
    ]);

    await Like.insertMany([
      { user: users[1]._id, project: projects[0]._id },
      { user: users[2]._id, project: projects[0]._id },
      { user: users[3]._id, project: projects[0]._id },
      { user: users[4]._id, project: projects[0]._id },
      { user: users[0]._id, project: projects[2]._id },
      { user: users[4]._id, project: projects[2]._id },
      { user: users[1]._id, project: projects[3]._id },
      { user: users[3]._id, project: projects[3]._id },
      { user: users[4]._id, project: projects[3]._id },
      { user: users[2]._id, project: projects[4]._id },
      { user: users[0]._id, project: projects[4]._id },
      { user: users[1]._id, project: projects[5]._id },
      { user: users[2]._id, project: projects[5]._id },
      { user: users[3]._id, project: projects[5]._id },
    ]);

    await Bookmark.insertMany([
      { user: users[0]._id, project: projects[0]._id, collectionName: 'default' },
      { user: users[1]._id, project: projects[0]._id, collectionName: 'default' },
      { user: users[2]._id, project: projects[3]._id, collectionName: 'reference' },
      { user: users[0]._id, project: projects[3]._id, collectionName: 'reference' },
      { user: users[3]._id, project: projects[4]._id, collectionName: 'default' },
      { user: users[4]._id, project: projects[5]._id, collectionName: 'default' },
    ]);

    const communityPosts = await CommunityPost.create([
      { user: users[0]._id, content: 'After six months of building on this platform, the single biggest improvement was adding a content-hash cache in front of our AI calls. Our inference bill dropped 70% and p95 latency dropped from 2.4s to 380ms. If you are calling a paid LLM API, do this before you do anything else.' },
      { user: users[1]._id, content: 'Counterpoint to caching everything: make sure your cache key includes everything that changes the output. We cached on the document hash but not the model version, so a model upgrade silently served stale answers for a week before anyone noticed.' },
      { user: users[2]._id, content: 'Reminder that at-least-once delivery is the honest default for any queue that hands work to a separate datastore. Exactly-once across two systems needs distributed transactions. Write idempotent handlers and document the requirement rather than pretending the queue guarantees it.' },
      { user: users[3]._id, content: 'Worth saying: parallelising independent infrastructure provisioning cut our first deploy from 11 minutes to under 90 seconds. Most of that was serialization, not slow resources. Profile before you optimise the slow part.' },
      { user: users[4]._id, content: 'Accessibility gate in CI saved us repeatedly. The one that got me: our combobox passed axe-core cleanly and was still completely unusable with a keyboard. Automated checks find rule violations, not broken interactions. You still need real keyboard tests.' },
    ]);

    const cacheComment = await CommunityComment.create({
      user: users[4]._id, communityPost: communityPosts[0]._id,
      content: 'The model version in the cache key bit us too. We now namespace caches by model and prompt version so a change is an explicit bust.',
    });

    await CommunityComment.create([
      { user: users[1]._id, communityPost: communityPosts[0]._id, content: 'Was the 70% mostly duplicate submissions or genuine repeats? Curious how much of that win is real-world vs. the same user clicking twice.' },
      { user: users[2]._id, communityPost: communityPosts[1]._id, content: 'This is the mistake everyone makes exactly once. Namespace by prompt version is the fix, and honestly it should be the default template.' },
      { user: users[0]._id, communityPost: communityPosts[2]._id, content: 'Agreed. We made consumers idempotent by putting the job id in a unique column on their side, so a redelivery is a no-op insert rather than a duplicate write.' },
      { user: users[3]._id, communityPost: communityPosts[2]._id, content: 'The idempotency key living in the consumer database rather than the queue is the detail that makes this work. Thanks for spelling it out.' },
      { user: users[2]._id, communityPost: communityPosts[3]._id, content: 'Topological sort over an explicit dependency graph is the pattern. We did the same and it was the single best perf win in our deploy tooling.' },
      { user: users[0]._id, communityPost: communityPosts[4]._id, content: 'Axe passing and usable are genuinely different bars. We now require a scripted keyboard walkthrough for any component that takes focus, not just an axe run.' },
    ]);

    await CommunityComment.create({
      user: users[0]._id, communityPost: communityPosts[0]._id, parentComment: cacheComment._id,
      content: 'Mostly genuine repeats. About 60% was the same user re-submitting after tweaking a bullet point, which is exactly the case where caching is transparent and the user sees no downside.',
    });

    await DirectMessage.create([
      { sender: users[0]._id, recipient: users[1]._id, content: 'Hey Sarah, your hybrid retrieval write-up on the Knowledge Agent project was exactly what I needed. We were stuck on the same recall problem and the BM25 fusion fixed it.', read: true },
      { sender: users[1]._id, recipient: users[0]._id, content: 'Glad it helped! The eval set is the part that made it convincing. Did you end up weighting BM25 higher for identifier-like queries?', read: true },
      { sender: users[0]._id, recipient: users[1]._id, content: 'We did, same as you. Identifier tokens get a 1.8x multiplier. Precision on natural language queries did not move at all.', read: true },
      { sender: users[2]._id, recipient: users[0]._id, content: 'Saw your AI Resume Analyzer project. Question on the content-hash cache: are you hashing the normalised text or the original upload?', read: true },
      { sender: users[0]._id, recipient: users[2]._id, content: 'Normalised text. Hashing the original meant a cosmetic whitespace change in the PDF produced a cache miss, which defeated the point.', read: true },
      { sender: users[0]._id, recipient: users[2]._id, content: 'That normalisation step is easy to miss and expensive to discover. Good catch.', read: false },
      { sender: users[3]._id, recipient: users[0]._id, content: 'Your reconciliation rewrite on Cloud Deploy CLI is what pushed me to rebuild our internal deploy tool. Re-running a failed deploy without duplicating resources is such an obvious requirement in hindsight.', read: false },
      { sender: users[3]._id, recipient: users[0]._id, content: 'Also curious how you handled resources where there is no stable natural identifier for the state diff.', read: false },
    ]);

    console.log('Seed data created successfully!');
    console.log('---');
    console.log('Demo account: demo@buildatlas.dev / password123');
    console.log('Other users: sarah@example.com, marcus@example.com, elena@example.com, alex@example.com (password: password123)');
    console.log(`Projects: ${projects.length}, diagrams: 3, schemas: 3, api endpoints: 8`);
    console.log(`Decisions: 13, problems: 10, timeline events: 25, deployments: 6, lessons: 20`);
    console.log(`Comments: 8, likes: 14, bookmarks: 6, community posts: ${communityPosts.length}, DMs: 8`);
    process.exit(0);
  } catch (error) {
    console.error('Seed error:', error);
    process.exit(1);
  }
};

seed();
