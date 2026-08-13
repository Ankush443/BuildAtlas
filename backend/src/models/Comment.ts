import mongoose, { Schema, Document } from 'mongoose';

export interface IComment extends Document {
  user: mongoose.Types.ObjectId;
  project: mongoose.Types.ObjectId;
  content: string;
  parentComment?: mongoose.Types.ObjectId;
  likes: mongoose.Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
}

const commentSchema = new Schema<IComment>(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    project: { type: Schema.Types.ObjectId, ref: 'Project', required: true },
    content: { type: String, required: true, maxlength: 2000 },
    parentComment: { type: Schema.Types.ObjectId, ref: 'Comment', default: null },
    likes: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  },
  { timestamps: true }
);

commentSchema.index({ project: 1, createdAt: -1 });
commentSchema.index({ user: 1 });
commentSchema.index({ parentComment: 1 });

export const Comment = mongoose.model<IComment>('Comment', commentSchema);
