import { Response, NextFunction } from 'express';
import { AuthRequest } from '../middleware/auth.middleware';
import { commentService } from '../services/comment.service';

export class CommentController {
  async create(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const comment = await commentService.create(req.user!._id.toString(), req.params.projectId, req.body);
      res.status(201).json({ success: true, data: comment, message: 'Comment created' });
    } catch (error) { next(error); }
  }

  async getByProject(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const result = await commentService.getByProject(req.params.projectId, Number(req.query.page) || 1);
      res.json({ success: true, data: result });
    } catch (error) { next(error); }
  }

  async getReplies(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const replies = await commentService.getReplies(req.params.commentId);
      res.json({ success: true, data: replies });
    } catch (error) { next(error); }
  }

  async update(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const comment = await commentService.update(req.params.commentId, req.user!._id.toString(), req.body.content);
      res.json({ success: true, data: comment, message: 'Comment updated' });
    } catch (error) { next(error); }
  }

  async delete(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      await commentService.delete(req.params.commentId, req.user!._id.toString());
      res.json({ success: true, data: null, message: 'Comment deleted' });
    } catch (error) { next(error); }
  }

  async likeComment(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      await commentService.likeComment(req.params.commentId, req.user!._id.toString());
      res.json({ success: true, data: null, message: 'Comment liked' });
    } catch (error) { next(error); }
  }

  async unlikeComment(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      await commentService.unlikeComment(req.params.commentId, req.user!._id.toString());
      res.json({ success: true, data: null, message: 'Comment unliked' });
    } catch (error) { next(error); }
  }
}

export const commentController = new CommentController();
