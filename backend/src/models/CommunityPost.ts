import mongoose, { Schema, Document } from 'mongoose';

export interface ICommunityPost extends Document {
  user: mongoose.Types.ObjectId;
  content: string;
  likes: mongoose.Types.ObjectId[];
  createdAt: Date;
}

const communityPostSchema = new Schema<ICommunityPost>(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    content: { type: String, required: true, maxlength: 2000 },
    likes: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  },
  { timestamps: true }
);

communityPostSchema.index({ user: 1, createdAt: -1 });

export const CommunityPost = mongoose.model<ICommunityPost>('CommunityPost', communityPostSchema);