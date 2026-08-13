import { Response, NextFunction } from 'express';
import { AuthRequest } from '../middleware/auth.middleware';
import { analyticsService } from '../services/analytics.service';

export class AnalyticsController {
  async getProjectAnalytics(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const days = Number(req.query.days) || 30;
      const analytics = await analyticsService.getProjectAnalytics(req.params.projectId, req.user!._id.toString(), days);
      res.json({ success: true, data: analytics });
    } catch (error) { next(error); }
  }
}

export const analyticsController = new AnalyticsController();
