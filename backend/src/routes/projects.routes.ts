import { Router } from 'express';
import { projectController } from '../controllers/project.controller';
import { technologyController } from '../controllers/technology.controller';
import { architectureController } from '../controllers/architecture.controller';
import { databaseController } from '../controllers/database.controller';
import { apiController } from '../controllers/api.controller';
import { decisionController } from '../controllers/decision.controller';
import { problemController } from '../controllers/problem.controller';
import { timelineController } from '../controllers/timeline.controller';
import { deploymentController } from '../controllers/deployment.controller';
import { lessonController } from '../controllers/lesson.controller';
import { likeController } from '../controllers/like.controller';
import { bookmarkController } from '../controllers/bookmark.controller';
import { commentController } from '../controllers/comment.controller';
import { analyticsController } from '../controllers/analytics.controller';
import { authenticate, optionalAuth } from '../middleware/auth.middleware';

const router = Router();

router.get('/', optionalAuth, projectController.list);
router.get('/trending', optionalAuth, projectController.getTrending);
router.get('/recent', optionalAuth, projectController.getRecent);
router.get('/my', authenticate, projectController.getMyProjects);
router.post('/', authenticate, projectController.create);

router.get('/:slug', optionalAuth, projectController.getBySlug);
router.patch('/:id', authenticate, projectController.update);
router.delete('/:id', authenticate, projectController.delete);
router.post('/:id/publish', authenticate, projectController.publish);
router.post('/:id/unpublish', authenticate, projectController.unpublish);

router.post('/:projectId/technologies', authenticate, technologyController.addToProject);
router.delete('/:projectId/technologies/:techId', authenticate, technologyController.removeFromProject);
router.get('/:projectId/technologies', optionalAuth, technologyController.getProjectTechs);

router.post('/:projectId/architecture', authenticate, architectureController.create);
router.get('/:projectId/architecture', optionalAuth, architectureController.getByProject);
router.patch('/architecture/:id', authenticate, architectureController.update);
router.delete('/architecture/:id', authenticate, architectureController.delete);

router.post('/:projectId/database', authenticate, databaseController.create);
router.get('/:projectId/database', optionalAuth, databaseController.getByProject);
router.patch('/database/:id', authenticate, databaseController.update);
router.delete('/database/:id', authenticate, databaseController.delete);

router.post('/:projectId/api-docs', authenticate, apiController.create);
router.get('/:projectId/api-docs', optionalAuth, apiController.getByProject);
router.patch('/api-docs/:id', authenticate, apiController.update);
router.delete('/api-docs/:id', authenticate, apiController.delete);

router.post('/:projectId/decisions', authenticate, decisionController.create);
router.get('/:projectId/decisions', optionalAuth, decisionController.getByProject);
router.patch('/decisions/:id', authenticate, decisionController.update);
router.delete('/decisions/:id', authenticate, decisionController.delete);

router.post('/:projectId/problems', authenticate, problemController.create);
router.get('/:projectId/problems', optionalAuth, problemController.getByProject);
router.patch('/problems/:id', authenticate, problemController.update);
router.delete('/problems/:id', authenticate, problemController.delete);

router.post('/:projectId/timeline', authenticate, timelineController.create);
router.get('/:projectId/timeline', optionalAuth, timelineController.getByProject);
router.patch('/timeline/:id', authenticate, timelineController.update);
router.delete('/timeline/:id', authenticate, timelineController.delete);

router.post('/:projectId/deployment', authenticate, deploymentController.create);
router.get('/:projectId/deployment', optionalAuth, deploymentController.getByProject);
router.patch('/deployment/:id', authenticate, deploymentController.update);

router.post('/:projectId/lessons', authenticate, lessonController.create);
router.get('/:projectId/lessons', optionalAuth, lessonController.getByProject);
router.patch('/lessons/:id', authenticate, lessonController.update);
router.delete('/lessons/:id', authenticate, lessonController.delete);

router.post('/:projectId/like', authenticate, likeController.like);
router.delete('/:projectId/like', authenticate, likeController.unlike);
router.get('/:projectId/is-liked', authenticate, likeController.checkLiked);

router.post('/:projectId/bookmark', authenticate, bookmarkController.bookmark);
router.delete('/:projectId/bookmark', authenticate, bookmarkController.unbookmark);
router.get('/:projectId/is-bookmarked', authenticate, bookmarkController.checkBookmarked);

router.get('/:projectId/comments', optionalAuth, commentController.getByProject);
router.post('/:projectId/comments', authenticate, commentController.create);
router.get('/comments/:commentId/replies', optionalAuth, commentController.getReplies);
router.patch('/comments/:commentId', authenticate, commentController.update);
router.delete('/comments/:commentId', authenticate, commentController.delete);
router.post('/comments/:commentId/like', authenticate, commentController.likeComment);
router.delete('/comments/:commentId/like', authenticate, commentController.unlikeComment);

router.get('/:projectId/analytics', authenticate, analyticsController.getProjectAnalytics);

export default router;
