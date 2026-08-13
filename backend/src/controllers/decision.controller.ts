import { Response, NextFunction } from 'express';
import { AuthRequest } from '../middleware/auth.middleware';
import { EngineeringDecision } from '../models/EngineeringDecision';
import { AppError } from '../middleware/error.middleware';

export class DecisionController {
  async create(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const decision = await EngineeringDecision.create({ ...req.body, project: req.params.projectId });
      res.status(201).json({ success: true, data: decision, message: 'Decision created' });
    } catch (error) { next(error); }
  }

  async getByProject(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const decisions = await EngineeringDecision.find({ project: req.params.projectId }).sort({ date: -1 });
      res.json({ success: true, data: decisions });
    } catch (error) { next(error); }
  }

  async update(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const decision = await EngineeringDecision.findByIdAndUpdate(req.params.id, req.body, { new: true });
      if (!decision) throw new AppError('Decision not found', 404, 'NOT_FOUND');
      res.json({ success: true, data: decision, message: 'Decision updated' });
    } catch (error) { next(error); }
  }

  async delete(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      await EngineeringDecision.findByIdAndDelete(req.params.id);
      res.json({ success: true, data: null, message: 'Decision deleted' });
    } catch (error) { next(error); }
  }
}

export const decisionController = new DecisionController();
