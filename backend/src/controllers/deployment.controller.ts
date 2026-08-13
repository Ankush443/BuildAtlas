import { Response, NextFunction } from 'express';
import { AuthRequest } from '../middleware/auth.middleware';
import { Deployment } from '../models/Deployment';
import { AppError } from '../middleware/error.middleware';

export class DeploymentController {
  async create(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const deployment = await Deployment.create({ ...req.body, project: req.params.projectId });
      res.status(201).json({ success: true, data: deployment, message: 'Deployment created' });
    } catch (error) { next(error); }
  }

  async getByProject(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const deployment = await Deployment.findOne({ project: req.params.projectId });
      res.json({ success: true, data: deployment });
    } catch (error) { next(error); }
  }

  async update(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const deployment = await Deployment.findByIdAndUpdate(req.params.id, req.body, { new: true, upsert: true });
      res.json({ success: true, data: deployment, message: 'Deployment updated' });
    } catch (error) { next(error); }
  }
}

export const deploymentController = new DeploymentController();
