import { Response, NextFunction } from 'express';
import { AuthRequest } from '../middleware/auth.middleware';
import { likeService } from '../services/like.service';

export class LikeController {
  async like(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const result = await likeService.like(req.user!._id.toString(), req.params.projectId);
      res.json({ success: true, data: result });
    } catch (error) { next(error); }
  }

  async unlike(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const result = await likeService.unlike(req.user!._id.toString(), req.params.projectId);
      res.json({ success: true, data: result });
    } catch (error) { next(error); }
  }

  async checkLiked(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const liked = await likeService.hasLiked(req.user!._id.toString(), req.params.projectId);
      res.json({ success: true, data: { liked } });
    } catch (error) { next(error); }
  }
}

export const likeController = new LikeController();
