import mongoose, { Schema, Document } from 'mongoose';

export interface IDatabaseSchema extends Document {
  project: mongoose.Types.ObjectId;
  name: string;
  description: string;
  collections: any[];
  relationships: any[];
  createdAt: Date;
  updatedAt: Date;
}

const databaseSchemaSchema = new Schema<IDatabaseSchema>(
  {
    project: { type: Schema.Types.ObjectId, ref: 'Project', required: true },
    name: { type: String, required: true, trim: true },
    description: { type: String, default: '' },
    collections: { type: Schema.Types.Mixed, default: [] },
    relationships: { type: Schema.Types.Mixed, default: [] },
  },
  { timestamps: true }
);

databaseSchemaSchema.index({ project: 1 });

export const DatabaseSchema = mongoose.model<IDatabaseSchema>('DatabaseSchema', databaseSchemaSchema);
