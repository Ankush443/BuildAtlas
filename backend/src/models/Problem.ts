import mongoose, { Schema, Document } from 'mongoose';

export interface IProblem extends Document {
  project: mongoose.Types.ObjectId;
  title: string;
  description: string;
  symptoms: string;
  rootCause: string;
  investigation: string;
  failedApproaches: string[];
  finalSolution: string;
  result: string;
  lessonsLearned: string;
  createdAt: Date;
  updatedAt: Date;
}

const problemSchema = new Schema<IProblem>(
  {
    project: { type: Schema.Types.ObjectId, ref: 'Project', required: true },
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    symptoms: { type: String, default: '' },
    rootCause: { type: String, default: '' },
    investigation: { type: String, default: '' },
    failedApproaches: [{ type: String }],
    finalSolution: { type: String, default: '' },
    result: { type: String, default: '' },
    lessonsLearned: { type: String, default: '' },
  },
  { timestamps: true }
);

problemSchema.index({ project: 1 });

export const Problem = mongoose.model<IProblem>('Problem', problemSchema);
