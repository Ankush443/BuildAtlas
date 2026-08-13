import mongoose, { Schema, Document } from 'mongoose';

export interface IProjectView extends Document {
  project: mongoose.Types.ObjectId;
  user?: mongoose.Types.ObjectId;
  ip: string;
  userAgent: string;
  createdAt: Date;
}

const projectViewSchema = new Schema<IProjectView>(
  {
    project: { type: Schema.Types.ObjectId, ref: 'Project', required: true },
    user: { type: Schema.Types.ObjectId, ref: 'User', default: null },
    ip: { type: String, default: '' },
    userAgent: { type: String, default: '' },
  },
  { timestamps: true }
);

projectViewSchema.index({ project: 1, createdAt: -1 });
projectViewSchema.index({ project: 1, user: 1 });

export const ProjectView = mongoose.model<IProjectView>('ProjectView', projectViewSchema);
