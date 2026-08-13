import mongoose, { Schema, Document } from 'mongoose';

export interface IProjectTechnology extends Document {
  project: mongoose.Types.ObjectId;
  technology: mongoose.Types.ObjectId;
  category: string;
  version: string;
  isPrimary: boolean;
  description: string;
  createdAt: Date;
}

const projectTechnologySchema = new Schema<IProjectTechnology>(
  {
    project: { type: Schema.Types.ObjectId, ref: 'Project', required: true },
    technology: { type: Schema.Types.ObjectId, ref: 'Technology', required: true },
    category: { type: String, required: true },
    version: { type: String, default: '' },
    isPrimary: { type: Boolean, default: false },
    description: { type: String, default: '' },
  },
  { timestamps: true }
);

projectTechnologySchema.index({ project: 1, technology: 1 }, { unique: true });
projectTechnologySchema.index({ project: 1 });

export const ProjectTechnology = mongoose.model<IProjectTechnology>('ProjectTechnology', projectTechnologySchema);
