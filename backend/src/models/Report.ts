import mongoose, { Schema, Document } from 'mongoose';

export interface IReport extends Document {
  reporter: mongoose.Types.ObjectId;
  targetType: 'project' | 'comment' | 'user';
  targetId: mongoose.Types.ObjectId;
  reason: 'spam' | 'abuse' | 'copyright' | 'malicious' | 'misleading' | 'other';
  description: string;
  status: 'pending' | 'reviewed' | 'resolved' | 'rejected';
  adminNote: string;
  createdAt: Date;
  updatedAt: Date;
}

const reportSchema = new Schema<IReport>(
  {
    reporter: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    targetType: { type: String, enum: ['project', 'comment', 'user'], required: true },
    targetId: { type: Schema.Types.ObjectId, required: true },
    reason: { type: String, enum: ['spam', 'abuse', 'copyright', 'malicious', 'misleading', 'other'], required: true },
    description: { type: String, default: '' },
    status: { type: String, enum: ['pending', 'reviewed', 'resolved', 'rejected'], default: 'pending' },
    adminNote: { type: String, default: '' },
  },
  { timestamps: true }
);

reportSchema.index({ targetType: 1, targetId: 1 });
reportSchema.index({ status: 1 });

export const Report = mongoose.model<IReport>('Report', reportSchema);
