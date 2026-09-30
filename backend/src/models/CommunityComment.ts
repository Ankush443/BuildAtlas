import mongoose, { Schema, Document } from 'mongoose';

export interface ICommunityComment extends Document {
  user: mongoose.Types.ObjectId;
  communityPost: mongoose.Types.ObjectId;
  content: string;
  parentComment?: mongoose.Types.ObjectId;
  likes: mongoose.Types.ObjectId[];
  createdAt: Date;
}

const communityCommentSchema = new Schema<ICommunityComment>(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    communityPost: { type: Schema.Types.ObjectId, ref: 'CommunityPost', required: true },
    content: { type: String, required: true, maxlength: 2000 },
    parentComment: { type: Schema.Types.ObjectId, ref: 'CommunityComment', default: null },
    likes: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  },
  { timestamps: true }
);

communityCommentSchema.index({ communityPost: 1, createdAt: -1 });
communityCommentSchema.index({ user: 1 });
communityCommentSchema.index({ parentComment: 1 });

export const CommunityComment = mongoose.model<ICommunityComment>('CommunityComment', communityCommentSchema);