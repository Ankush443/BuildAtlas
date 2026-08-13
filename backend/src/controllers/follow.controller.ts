import { Response, NextFunction } from 'express';
import { AuthRequest } from '../middleware/auth.middleware';
import { followService } from '../services/follow.service';

export class FollowController {
  async follow(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const result = await followService.follow(req.user!._id.toString(), req.params.userId);
      res.json({ success: true, data: result });
    } catch (error) { next(error); }
  }

  async unfollow(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const result = await followService.unfollow(req.user!._id.toString(), req.params.userId);
      res.json({ success: true, data: result });
    } catch (error) { next(error); }
  }

  async getFollowers(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const followers = await followService.getFollowers(req.params.userId);
      res.json({ success: true, data: followers });
    } catch (error) { next(error); }
  }

  async getFollowing(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const following = await followService.getFollowing(req.params.userId);
      res.json({ success: true, data: following });
    } catch (error) { next(error); }
  }

  async checkFollowing(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const isFollowing = await followService.isFollowing(req.user!._id.toString(), req.params.userId);
      res.json({ success: true, data: { isFollowing } });
    } catch (error) { next(error); }
  }
}

export const followController = new FollowController();
