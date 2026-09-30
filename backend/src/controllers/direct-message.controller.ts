import { Response, NextFunction } from 'express';
import { AuthRequest } from '../middleware/auth.middleware';
import { directMessageService } from '../services/direct-message.service';

export class DirectMessageController {
  async send(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const message = await directMessageService.send(
        req.user!._id.toString(),
        req.body.recipientId,
        req.body.content
      );
      res.status(201).json({ success: true, data: message, message: 'Message sent' });
    } catch (error) { next(error); }
  }

  async conversations(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const messages = await directMessageService.getConversations(req.user!._id.toString());
      res.json({ success: true, data: messages });
    } catch (error) { next(error); }
  }

  async messages(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const otherUserId = req.params.recipientId;
      const messages = await directMessageService.getMessages(req.user!._id.toString(), otherUserId);
      res.json({ success: true, data: messages });
    } catch (error) { next(error); }
  }

  async markRead(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const message = await directMessageService.markAsRead(req.params.messageId, req.user!._id.toString());
      res.json({ success: true, data: message, message: 'Message marked as read' });
    } catch (error) { next(error); }
  }
}

export const directMessageController = new DirectMessageController();