import { Router } from 'express';
import { adminController } from '../controllers/admin.controller';
import { reportController } from '../controllers/report.controller';
import { authenticate, authorize } from '../middleware/auth.middleware';

const router = Router();

router.get('/users', authenticate, authorize('admin'), adminController.getUsers);
router.get('/projects', authenticate, authorize('admin'), adminController.getProjects);
router.post('/users/:userId/suspend', authenticate, authorize('admin'), adminController.suspendUser);
router.post('/projects/:projectId/hide', authenticate, authorize('admin'), adminController.hideProject);
router.delete('/comments/:commentId', authenticate, authorize('admin'), adminController.deleteComment);
router.get('/reports', authenticate, authorize('admin'), adminController.getReports);
router.post('/reports/:reportId/resolve', authenticate, authorize('admin'), adminController.resolveReport);
router.post('/reports/:reportId/reject', authenticate, authorize('admin'), adminController.rejectReport);
router.get('/analytics', authenticate, authorize('admin'), adminController.getAnalytics);

router.post('/reports', authenticate, reportController.create);

export default router;
