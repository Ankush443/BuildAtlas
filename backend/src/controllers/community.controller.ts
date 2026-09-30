import { Response, NextFunction } from 'express';
import { AuthRequest } from '../middleware/auth.middleware';
import { communityPostService, communityCommentService } from '../services/community.service';

export class CommunityController {
  async createPost(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const post = await communityPostService.create(req.user!._id.toString(), req.body.content);
      res.status(201).json({ success: true, data: post, message: 'Post created' });
    } catch (error) { next(error); }
  }

  async getAll(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const result = await communityPostService.getAll();
      res.json({ success: true, data: result });
    } catch (error) { next(error); }
  }

  async likePost(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const post = await communityPostService.likePost(req.params.postId, req.user!._id.toString());
      res.json({ success: true, data: post, message: 'Post liked' });
    } catch (error) { next(error); }
  }

  async unlikePost(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      await communityPostService.unlikePost(req.params.postId, req.user!._id.toString());
      res.json({ success: true, data: null, message: 'Post unliked' });
    } catch (error) { next(error); }
  }

  async createComment(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const comment = await communityCommentService.create(
        req.user!._id.toString(),
        req.params.postId,
        req.body.content,
        req.body.parentComment
      );
      res.status(201).json({ success: true, data: comment, message: 'Comment created' });
    } catch (error) { next(error); }
  }

  async getComments(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const result = await communityCommentService.getByPost(req.params.postId);
      res.json({ success: true, data: result });
    } catch (error) { next(error); }
  }

  async getReplies(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const replies = await communityCommentService.getReplies(req.params.commentId);
      res.json({ success: true, data: replies });
    } catch (error) { next(error); }
  }

  async updateComment(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const comment = await communityCommentService.update(req.params.commentId, req.user!._id.toString(), req.body.content);
      res.json({ success: true, data: comment, message: 'Comment updated' });
    } catch (error) { next(error); }
  }

  async deleteComment(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      await communityCommentService.delete(req.params.commentId, req.user!._id.toString());
      res.json({ success: true, data: null, message: 'Comment deleted' });
    } catch (error) { next(error); }
  }

  async likeComment(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      await communityCommentService.likeComment(req.params.commentId, req.user!._id.toString());
      res.json({ success: true, data: null, message: 'Comment liked' });
    } catch (error) { next(error); }
  }

  async unlikeComment(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      await communityCommentService.unlikeComment(req.params.commentId, req.user!._id.toString());
      res.json({ success: true, data: null, message: 'Comment unliked' });
    } catch (error) { next(error); }
  }
}

export const communityController = new CommunityController();