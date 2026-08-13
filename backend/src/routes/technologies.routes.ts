import { Router } from 'express';
import { technologyController } from '../controllers/technology.controller';
import { authenticate, optionalAuth } from '../middleware/auth.middleware';

const router = Router();

router.get('/', optionalAuth, technologyController.getAll);
router.get('/search', optionalAuth, technologyController.search);
router.post('/', authenticate, technologyController.create);

export default router;
