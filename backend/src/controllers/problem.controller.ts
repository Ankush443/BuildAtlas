import { Response, NextFunction } from 'express';
import { AuthRequest } from '../middleware/auth.middleware';
import { Problem } from '../models/Problem';
import { AppError } from '../middleware/error.middleware';

export class ProblemController {
  async create(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const problem = await Problem.create({ ...req.body, project: req.params.projectId });
      res.status(201).json({ success: true, data: problem, message: 'Problem created' });
    } catch (error) { next(error); }
  }

  async getByProject(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const problems = await Problem.find({ project: req.params.projectId }).sort({ createdAt: -1 });
      res.json({ success: true, data: problems });
    } catch (error) { next(error); }
  }

  async update(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const problem = await Problem.findByIdAndUpdate(req.params.id, req.body, { new: true });
      if (!problem) throw new AppError('Problem not found', 404, 'NOT_FOUND');
      res.json({ success: true, data: problem, message: 'Problem updated' });
    } catch (error) { next(error); }
  }

  async delete(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      await Problem.findByIdAndDelete(req.params.id);
      res.json({ success: true, data: null, message: 'Problem deleted' });
    } catch (error) { next(error); }
  }
}

export const problemController = new ProblemController();
