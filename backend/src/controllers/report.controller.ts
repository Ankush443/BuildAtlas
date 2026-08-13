import { Response, NextFunction } from 'express';
import { AuthRequest } from '../middleware/auth.middleware';
import { Report } from '../models/Report';
import { AppError } from '../middleware/error.middleware';

export class ReportController {
  async create(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const report = await Report.create({ ...req.body, reporter: req.user!._id.toString() });
      res.status(201).json({ success: true, data: report, message: 'Report submitted' });
    } catch (error) { next(error); }
  }
}

export const reportController = new ReportController();
