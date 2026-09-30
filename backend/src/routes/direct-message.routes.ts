import { Router } from 'express';
import { directMessageController } from '../controllers/direct-message.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

router.post('/', authenticate, directMessageController.send);
router.get('/conversations', authenticate, directMessageController.conversations);
router.get('/:recipientId', authenticate, directMessageController.messages);
router.post('/:messageId/read', authenticate, directMessageController.markRead);

export default router;