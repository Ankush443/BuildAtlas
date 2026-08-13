import mongoose, { Schema, Document } from 'mongoose';

export interface IProject extends Document {
  owner: mongoose.Types.ObjectId;
  name: string;
  slug: string;
  shortDescription: string;
  fullDescription: string;
  category: string;
  projectType: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  status: 'planning' | 'active-development' | 'production' | 'maintained' | 'archived';
  visibility: 'draft' | 'public' | 'private';
  startDate?: Date;
  endDate?: Date;
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
  publishedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const projectSchema = new Schema<IProject>(
  {
    owner: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    name: { type: String, required: true, trim: true, maxlength: 200 },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    shortDescription: { type: String, required: true, maxlength: 300 },
    fullDescription: { type: String, default: '' },
    category: { type: String, required: true },
    projectType: { type: String, required: true },
    difficulty: { type: String, enum: ['beginner', 'intermediate', 'advanced'], default: 'intermediate' },
    status: { type: String, enum: ['planning', 'active-development', 'production', 'maintained', 'archived'], default: 'planning' },
    visibility: { type: String, enum: ['draft', 'public', 'private'], default: 'draft' },
    startDate: { type: Date },
    endDate: { type: Date },
    repositoryUrl: { type: String, default: '' },
    liveUrl: { type: String, default: '' },
    demoUrl: { type: String, default: '' },
    documentationUrl: { type: String, default: '' },
    license: { type: String, default: '' },
    coverImage: { type: String, default: '' },
    logo: { type: String, default: '' },
    views: { type: Number, default: 0 },
    likesCount: { type: Number, default: 0 },
    bookmarksCount: { type: Number, default: 0 },
    commentsCount: { type: Number, default: 0 },
    publishedAt: { type: Date },
  },
  { timestamps: true }
);

projectSchema.index({ owner: 1 });
projectSchema.index({ slug: 1 });
projectSchema.index({ category: 1 });
projectSchema.index({ projectType: 1 });
projectSchema.index({ status: 1 });
projectSchema.index({ visibility: 1 });
projectSchema.index({ name: 'text', shortDescription: 'text', fullDescription: 'text' });
projectSchema.index({ views: -1 });
projectSchema.index({ likesCount: -1 });
projectSchema.index({ createdAt: -1 });

export const Project = mongoose.model<IProject>('Project', projectSchema);
