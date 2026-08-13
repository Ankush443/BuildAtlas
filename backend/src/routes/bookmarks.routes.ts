import { Router } from 'express';
import { bookmarkController } from '../controllers/bookmark.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

router.get('/', authenticate, bookmarkController.getMyBookmarks);

export default router;
