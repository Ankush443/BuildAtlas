import mongoose, { Schema, Document } from 'mongoose';

export interface IDeployment extends Document {
  project: mongoose.Types.ObjectId;
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
  diagram: any;
  createdAt: Date;
  updatedAt: Date;
}

const deploymentSchema = new Schema<IDeployment>(
  {
    project: { type: Schema.Types.ObjectId, ref: 'Project', required: true },
    cloudProvider: { type: String, default: '' },
    frontendHosting: { type: String, default: '' },
    backendHosting: { type: String, default: '' },
    databaseHosting: { type: String, default: '' },
    objectStorage: { type: String, default: '' },
    cdn: { type: String, default: '' },
    cicd: { type: String, default: '' },
    docker: { type: String, default: '' },
    domain: { type: String, default: '' },
    environmentConfig: { type: String, default: '' },
    diagram: { type: Schema.Types.Mixed, default: null },
  },
  { timestamps: true }
);

deploymentSchema.index({ project: 1 });

export const Deployment = mongoose.model<IDeployment>('Deployment', deploymentSchema);
