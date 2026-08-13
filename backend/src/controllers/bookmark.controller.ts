import { Response, NextFunction } from 'express';
import { AuthRequest } from '../middleware/auth.middleware';
import { bookmarkService } from '../services/bookmark.service';

export class BookmarkController {
  async bookmark(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const result = await bookmarkService.bookmark(req.user!._id.toString(), req.params.projectId, req.body.collection);
      res.json({ success: true, data: result });
    } catch (error) { next(error); }
  }

  async unbookmark(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const result = await bookmarkService.unbookmark(req.user!._id.toString(), req.params.projectId);
      res.json({ success: true, data: result });
    } catch (error) { next(error); }
  }

  async getMyBookmarks(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const bookmarks = await bookmarkService.getUserBookmarks(req.user!._id.toString());
      res.json({ success: true, data: bookmarks });
    } catch (error) { next(error); }
  }

  async checkBookmarked(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const bookmarked = await bookmarkService.hasBookmarked(req.user!._id.toString(), req.params.projectId);
      res.json({ success: true, data: { bookmarked } });
    } catch (error) { next(error); }
  }
}

export const bookmarkController = new BookmarkController();
