import { Router } from 'express';
import { authController } from '../controllers/auth.controller';
import { followController } from '../controllers/follow.controller';
import { authenticate, optionalAuth } from '../middleware/auth.middleware';

const router = Router();

router.get('/:username', optionalAuth, authController.getUserByUsername);
router.patch('/me', authenticate, authController.updateProfile);
router.get('/:userId/followers', optionalAuth, followController.getFollowers);
router.get('/:userId/following', optionalAuth, followController.getFollowing);
router.post('/:userId/follow', authenticate, followController.follow);
router.delete('/:userId/follow', authenticate, followController.unfollow);
router.get('/:userId/is-following', authenticate, followController.checkFollowing);

export default router;
