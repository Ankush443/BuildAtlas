import { Bookmark } from '../models/Bookmark';
import { Project } from '../models/Project';
import { Notification } from '../models/Notification';
import { AppError } from '../middleware/error.middleware';

export class BookmarkService {
  async bookmark(userId: string, projectId: string, collection = 'default') {
    const project = await Project.findById(projectId);
    if (!project) throw new AppError('Project not found', 404, 'PROJECT_NOT_FOUND');

    const existing = await Bookmark.findOne({ user: userId, project: projectId });
    if (existing) throw new AppError('Already bookmarked', 409, 'ALREADY_BOOKMARKED');

    await Bookmark.create({ user: userId, project: projectId, collection });
    await Project.findByIdAndUpdate(projectId, { $inc: { bookmarksCount: 1 } });

    if (project.owner.toString() !== userId) {
      await Notification.create({
        recipient: project.owner,
        sender: userId,
        type: 'bookmark',
        project: projectId,
        message: 'bookmarked your project',
      });
    }
    return { message: 'Bookmarked' };
  }

  async unbookmark(userId: string, projectId: string) {
    const result = await Bookmark.findOneAndDelete({ user: userId, project: projectId });
    if (!result) throw new AppError('Not bookmarked', 404, 'NOT_BOOKMARKED');
    await Project.findByIdAndUpdate(projectId, { $inc: { bookmarksCount: -1 } });
    return { message: 'Unbookmarked' };
  }

  async getUserBookmarks(userId: string) {
    return Bookmark.find({ user: userId }).populate({ path: 'project', populate: { path: 'owner', select: 'name username avatar' } }).sort({ createdAt: -1 });
  }

  async hasBookmarked(userId: string, projectId: string): Promise<boolean> {
    const bookmark = await Bookmark.findOne({ user: userId, project: projectId });
    return !!bookmark;
  }
}

export const bookmarkService = new BookmarkService();
