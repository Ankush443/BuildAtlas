import mongoose, { Schema, Document } from 'mongoose';

export interface IGitHubRepository extends Document {
  user: mongoose.Types.ObjectId;
  project?: mongoose.Types.ObjectId;
  githubId: number;
  name: string;
  fullName: string;
  description: string;
  htmlUrl: string;
  stargazersCount: number;
  forksCount: number;
  language: string;
  topics: string[];
  license: string;
  defaultBranch: string;
  lastSyncedAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

const gitHubRepositorySchema = new Schema<IGitHubRepository>(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    project: { type: Schema.Types.ObjectId, ref: 'Project', default: null },
    githubId: { type: Number, required: true },
    name: { type: String, required: true },
    fullName: { type: String, required: true },
    description: { type: String, default: '' },
    htmlUrl: { type: String, required: true },
    stargazersCount: { type: Number, default: 0 },
    forksCount: { type: Number, default: 0 },
    language: { type: String, default: '' },
    topics: [{ type: String }],
    license: { type: String, default: '' },
    defaultBranch: { type: String, default: 'main' },
    lastSyncedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

gitHubRepositorySchema.index({ user: 1 });
gitHubRepositorySchema.index({ githubId: 1 });

export const GitHubRepository = mongoose.model<IGitHubRepository>('GitHubRepository', gitHubRepositorySchema);
