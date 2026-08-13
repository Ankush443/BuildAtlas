import mongoose, { Schema, Document } from 'mongoose';

export interface IApiEndpoint extends Document {
  project: mongoose.Types.ObjectId;
  method: string;
  endpoint: string;
  description: string;
  authentication: boolean;
  parameters: any[];
  requestBody: any;
  responseBody: any;
  statusCodes: any[];
  exampleRequest: string;
  exampleResponse: string;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

const apiEndpointSchema = new Schema<IApiEndpoint>(
  {
    project: { type: Schema.Types.ObjectId, ref: 'Project', required: true },
    method: { type: String, required: true, enum: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'] },
    endpoint: { type: String, required: true },
    description: { type: String, default: '' },
    authentication: { type: Boolean, default: false },
    parameters: { type: Schema.Types.Mixed, default: [] },
    requestBody: { type: Schema.Types.Mixed, default: null },
    responseBody: { type: Schema.Types.Mixed, default: null },
    statusCodes: { type: Schema.Types.Mixed, default: [] },
    exampleRequest: { type: String, default: '' },
    exampleResponse: { type: String, default: '' },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

apiEndpointSchema.index({ project: 1 });

export const ApiEndpoint = mongoose.model<IApiEndpoint>('ApiEndpoint', apiEndpointSchema);
