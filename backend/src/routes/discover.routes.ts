import { Router } from 'express';
import { technologyController } from '../controllers/technology.controller';
import { optionalAuth } from '../middleware/auth.middleware';

const router = Router();

router.get('/', optionalAuth, technologyController.getAll);
router.get('/search', optionalAuth, technologyController.search);

export default router;
