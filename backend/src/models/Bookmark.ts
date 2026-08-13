import mongoose, { Schema, Document } from 'mongoose';

export interface IBookmark extends Document {
  user: mongoose.Types.ObjectId;
  project: mongoose.Types.ObjectId;
  collection: string;
  createdAt: Date;
}

const bookmarkSchema = new Schema<IBookmark>(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    project: { type: Schema.Types.ObjectId, ref: 'Project', required: true },
    collection: { type: String, default: 'default' },
  },
  { timestamps: true }
);

bookmarkSchema.index({ user: 1, project: 1 }, { unique: true });
bookmarkSchema.index({ user: 1 });
bookmarkSchema.index({ project: 1 });

export const Bookmark = mongoose.model<IBookmark>('Bookmark', bookmarkSchema);
