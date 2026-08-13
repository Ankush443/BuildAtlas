import mongoose, { Schema, Document } from 'mongoose';

export interface ILesson extends Document {
  project: mongoose.Types.ObjectId;
  title: string;
  content: string;
  category: 'technical' | 'architecture' | 'performance' | 'security' | 'product' | 'mistake' | 'development';
  createdAt: Date;
  updatedAt: Date;
}

const lessonSchema = new Schema<ILesson>(
  {
    project: { type: Schema.Types.ObjectId, ref: 'Project', required: true },
    title: { type: String, required: true, trim: true },
    content: { type: String, required: true },
    category: { type: String, enum: ['technical', 'architecture', 'performance', 'security', 'product', 'mistake', 'development'], required: true },
  },
  { timestamps: true }
);

lessonSchema.index({ project: 1 });
lessonSchema.index({ category: 1 });

export const Lesson = mongoose.model<ILesson>('Lesson', lessonSchema);
