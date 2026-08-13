import mongoose, { Schema, Document } from 'mongoose';

export interface ILike extends Document {
  user: mongoose.Types.ObjectId;
  project: mongoose.Types.ObjectId;
  createdAt: Date;
}

const likeSchema = new Schema<ILike>(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    project: { type: Schema.Types.ObjectId, ref: 'Project', required: true },
  },
  { timestamps: true }
);

likeSchema.index({ user: 1, project: 1 }, { unique: true });
likeSchema.index({ project: 1 });

export const Like = mongoose.model<ILike>('Like', likeSchema);
