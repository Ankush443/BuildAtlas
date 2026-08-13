import { Router } from 'express';
import { notificationController } from '../controllers/notification.controller';
import { bookmarkController } from '../controllers/bookmark.controller';
import { githubController } from '../controllers/github.controller';
import { adminController } from '../controllers/admin.controller';
import { reportController } from '../controllers/report.controller';
import { authenticate, authorize } from '../middleware/auth.middleware';

const router = Router();

router.get('/', authenticate, notificationController.getMyNotifications);
router.get('/unread-count', authenticate, notificationController.getUnreadCount);
router.patch('/:id/read', authenticate, notificationController.markAsRead);
router.post('/read-all', authenticate, notificationController.markAllAsRead);

export default router;
