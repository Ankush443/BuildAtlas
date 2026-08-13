import mongoose, { Schema, Document } from 'mongoose';

export interface IArchitectureDiagram extends Document {
  project: mongoose.Types.ObjectId;
  title: string;
  description: string;
  nodes: any[];
  edges: any[];
  createdAt: Date;
  updatedAt: Date;
}

const architectureDiagramSchema = new Schema<IArchitectureDiagram>(
  {
    project: { type: Schema.Types.ObjectId, ref: 'Project', required: true },
    title: { type: String, required: true, trim: true },
    description: { type: String, default: '' },
    nodes: { type: Schema.Types.Mixed, default: [] },
    edges: { type: Schema.Types.Mixed, default: [] },
  },
  { timestamps: true }
);

architectureDiagramSchema.index({ project: 1 });

export const ArchitectureDiagram = mongoose.model<IArchitectureDiagram>('ArchitectureDiagram', architectureDiagramSchema);
