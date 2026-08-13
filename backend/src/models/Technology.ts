import mongoose, { Schema, Document } from 'mongoose';

export interface ITechnology extends Document {
  name: string;
  slug: string;
  category: 'frontend' | 'backend' | 'database' | 'ai-ml' | 'infrastructure' | 'tools';
  logo: string;
  website: string;
  description: string;
  createdAt: Date;
  updatedAt: Date;
}

const technologySchema = new Schema<ITechnology>(
  {
    name: { type: String, required: true, unique: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true },
    category: { type: String, enum: ['frontend', 'backend', 'database', 'ai-ml', 'infrastructure', 'tools'], required: true },
    logo: { type: String, default: '' },
    website: { type: String, default: '' },
    description: { type: String, default: '' },
  },
  { timestamps: true }
);

technologySchema.index({ name: 'text' });
technologySchema.index({ category: 1 });

export const Technology = mongoose.model<ITechnology>('Technology', technologySchema);
