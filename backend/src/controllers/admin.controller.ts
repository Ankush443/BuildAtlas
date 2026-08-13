import { Response, NextFunction } from 'express';
import { AuthRequest } from '../middleware/auth.middleware';
import { adminService } from '../services/admin.service';
import { Report } from '../models/Report';

export class AdminController {
  async getUsers(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const result = await adminService.getUsers(Number(req.query.page) || 1, Number(req.query.limit) || 20, req.query.search as string);
      res.json({ success: true, data: result });
    } catch (error) { next(error); }
  }

  async getProjects(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const result = await adminService.getProjects(Number(req.query.page) || 1, Number(req.query.limit) || 20, req.query.search as string);
      res.json({ success: true, data: result });
    } catch (error) { next(error); }
  }

  async suspendUser(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      await adminService.suspendUser(req.params.userId);
      res.json({ success: true, data: null, message: 'User suspended' });
    } catch (error) { next(error); }
  }

  async hideProject(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      await adminService.hideProject(req.params.projectId);
      res.json({ success: true, data: null, message: 'Project hidden' });
    } catch (error) { next(error); }
  }

  async deleteComment(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      await adminService.deleteComment(req.params.commentId);
      res.json({ success: true, data: null, message: 'Comment deleted' });
    } catch (error) { next(error); }
  }

  async getReports(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const result = await adminService.getReports(Number(req.query.page) || 1, Number(req.query.limit) || 20, req.query.status as string);
      res.json({ success: true, data: result });
    } catch (error) { next(error); }
  }

  async resolveReport(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const report = await adminService.resolveReport(req.params.reportId, req.body.adminNote);
      res.json({ success: true, data: report, message: 'Report resolved' });
    } catch (error) { next(error); }
  }

  async rejectReport(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const report = await adminService.rejectReport(req.params.reportId, req.body.adminNote);
      res.json({ success: true, data: report, message: 'Report rejected' });
    } catch (error) { next(error); }
  }

  async getAnalytics(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const analytics = await adminService.getAnalytics();
      res.json({ success: true, data: analytics });
    } catch (error) { next(error); }
  }
}

export const adminController = new AdminController();
