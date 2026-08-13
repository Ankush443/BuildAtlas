import { Response, NextFunction } from 'express';
import { AuthRequest } from '../middleware/auth.middleware';
import { notificationService } from '../services/notification.service';

export class NotificationController {
  async getMyNotifications(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const result = await notificationService.getByUser(req.user!._id.toString(), Number(req.query.page) || 1);
      res.json({ success: true, data: result });
    } catch (error) { next(error); }
  }

  async markAsRead(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      await notificationService.markAsRead(req.user!._id.toString(), req.params.id);
      res.json({ success: true, data: null, message: 'Notification marked as read' });
    } catch (error) { next(error); }
  }

  async markAllAsRead(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      await notificationService.markAllAsRead(req.user!._id.toString());
      res.json({ success: true, data: null, message: 'All notifications marked as read' });
    } catch (error) { next(error); }
  }

  async getUnreadCount(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const count = await notificationService.getUnreadCount(req.user!._id.toString());
      res.json({ success: true, data: { count } });
    } catch (error) { next(error); }
  }
}

export const notificationController = new NotificationController();
