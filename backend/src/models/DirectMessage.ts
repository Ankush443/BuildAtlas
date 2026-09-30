import mongoose, { Schema, Document } from 'mongoose';

export interface IDirectMessage extends Document {
  sender: mongoose.Types.ObjectId;
  recipient: mongoose.Types.ObjectId;
  content: string;
  read: boolean;
  createdAt: Date;
}

const directMessageSchema = new Schema<IDirectMessage>(
  {
    sender: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    recipient: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    content: { type: String, required: true },
    read: { type: Boolean, default: false },
  },
  { timestamps: true }
);

directMessageSchema.index({ sender: 1, createdAt: -1 });
directMessageSchema.index({ recipient: 1, createdAt: -1 });

export const DirectMessage = mongoose.model<IDirectMessage>('DirectMessage', directMessageSchema);