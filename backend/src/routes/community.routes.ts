import { Router } from 'express';
import { communityController } from '../controllers/community.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

router.post('/', authenticate, communityController.createPost);
router.get('/', communityController.getAll);
router.post('/:postId/like', authenticate, communityController.likePost);
router.delete('/:postId/like', authenticate, communityController.unlikePost);
router.post('/:postId/comments', authenticate, communityController.createComment);
router.get('/:postId/comments', communityController.getComments);
router.get('/comments/:commentId/replies', communityController.getReplies);
router.patch('/comments/:commentId', authenticate, communityController.updateComment);
router.delete('/comments/:commentId', authenticate, communityController.deleteComment);
router.post('/comments/:commentId/like', authenticate, communityController.likeComment);
router.delete('/comments/:commentId/like', authenticate, communityController.unlikeComment);

export default router;