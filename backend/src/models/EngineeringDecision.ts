import mongoose, { Schema, Document } from 'mongoose';

export interface IEngineeringDecision extends Document {
  project: mongoose.Types.ObjectId;
  title: string;
  problem: string;
  context: string;
  options: string[];
  selectedSolution: string;
  reason: string;
  tradeoffs: string;
  consequences: string;
  status: 'proposed' | 'accepted' | 'deprecated' | 'superseded';
  date: Date;
  createdAt: Date;
  updatedAt: Date;
}

const engineeringDecisionSchema = new Schema<IEngineeringDecision>(
  {
    project: { type: Schema.Types.ObjectId, ref: 'Project', required: true },
    title: { type: String, required: true, trim: true },
    problem: { type: String, required: true },
    context: { type: String, default: '' },
    options: [{ type: String }],
    selectedSolution: { type: String, required: true },
    reason: { type: String, required: true },
    tradeoffs: { type: String, default: '' },
    consequences: { type: String, default: '' },
    status: { type: String, enum: ['proposed', 'accepted', 'deprecated', 'superseded'], default: 'proposed' },
    date: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

engineeringDecisionSchema.index({ project: 1 });

export const EngineeringDecision = mongoose.model<IEngineeringDecision>('EngineeringDecision', engineeringDecisionSchema);
