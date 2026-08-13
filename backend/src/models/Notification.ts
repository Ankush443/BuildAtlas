import mongoose, { Schema, Document } from 'mongoose';

export interface INotification extends Document {
  recipient: mongoose.Types.ObjectId;
  sender: mongoose.Types.ObjectId;
  type: 'follow' | 'like' | 'bookmark' | 'comment' | 'comment_reply';
  project?: mongoose.Types.ObjectId;
  comment?: mongoose.Types.ObjectId;
  message: string;
  read: boolean;
  createdAt: Date;
}

const notificationSchema = new Schema<INotification>(
  {
    recipient: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    sender: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    type: { type: String, enum: ['follow', 'like', 'bookmark', 'comment', 'comment_reply'], required: true },
    project: { type: Schema.Types.ObjectId, ref: 'Project', default: null },
    comment: { type: Schema.Types.ObjectId, ref: 'Comment', default: null },
    message: { type: String, required: true },
    read: { type: Boolean, default: false },
  },
  { timestamps: true }
);

notificationSchema.index({ recipient: 1, createdAt: -1 });
notificationSchema.index({ recipient: 1, read: 1 });

export const Notification = mongoose.model<INotification>('Notification', notificationSchema);
