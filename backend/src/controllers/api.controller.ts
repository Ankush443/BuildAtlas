import { Response, NextFunction } from 'express';
import { AuthRequest } from '../middleware/auth.middleware';
import { ApiEndpoint } from '../models/ApiEndpoint';
import { AppError } from '../middleware/error.middleware';

export class ApiController {
  async create(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const endpoint = await ApiEndpoint.create({ ...req.body, project: req.params.projectId });
      res.status(201).json({ success: true, data: endpoint, message: 'API endpoint created' });
    } catch (error) { next(error); }
  }

  async getByProject(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const endpoints = await ApiEndpoint.find({ project: req.params.projectId }).sort({ order: 1 });
      res.json({ success: true, data: endpoints });
    } catch (error) { next(error); }
  }

  async update(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const endpoint = await ApiEndpoint.findByIdAndUpdate(req.params.id, req.body, { new: true });
      if (!endpoint) throw new AppError('Endpoint not found', 404, 'NOT_FOUND');
      res.json({ success: true, data: endpoint, message: 'Endpoint updated' });
    } catch (error) { next(error); }
  }

  async delete(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      await ApiEndpoint.findByIdAndDelete(req.params.id);
      res.json({ success: true, data: null, message: 'Endpoint deleted' });
    } catch (error) { next(error); }
  }
}

export const apiController = new ApiController();
