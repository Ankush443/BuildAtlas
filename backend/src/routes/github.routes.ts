import { Router } from 'express';
import { githubController } from '../controllers/github.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

router.post('/repositories', authenticate, githubController.getRepositories);
router.post('/import', authenticate, githubController.importFromGitHub);

export default router;
