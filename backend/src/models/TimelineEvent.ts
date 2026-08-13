import mongoose, { Schema, Document } from 'mongoose';

export interface ITimelineEvent extends Document {
  project: mongoose.Types.ObjectId;
  title: string;
  description: string;
  date: Date;
  image: string;
  githubRef: string;
  createdAt: Date;
  updatedAt: Date;
}

const timelineEventSchema = new Schema<ITimelineEvent>(
  {
    project: { type: Schema.Types.ObjectId, ref: 'Project', required: true },
    title: { type: String, required: true, trim: true },
    description: { type: String, default: '' },
    date: { type: Date, required: true },
    image: { type: String, default: '' },
    githubRef: { type: String, default: '' },
  },
  { timestamps: true }
);

timelineEventSchema.index({ project: 1, date: 1 });

export const TimelineEvent = mongoose.model<ITimelineEvent>('TimelineEvent', timelineEventSchema);
