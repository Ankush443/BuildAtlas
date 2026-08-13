import { ProjectView } from '../models/ProjectView';
import { Project } from '../models/Project';
import { paginate, buildPaginationResponse } from '../utils/helpers';

export class AnalyticsService {
  async trackView(projectId: string, userId?: string, ip?: string, userAgent?: string) {
    await ProjectView.create({ project: projectId, user: userId, ip, userAgent });
    await Project.findByIdAndUpdate(projectId, { $inc: { views: 1 } });
  }

  async getProjectAnalytics(projectId: string, userId: string, days = 30) {
    const project = await Project.findById(projectId);
    if (!project) throw new Error('Project not found');
    if (project.owner.toString() !== userId) throw new Error('Not authorized');

    const since = new Date();
    since.setDate(since.getDate() - days);

    const [totalViews, uniqueVisitors, viewsOverTime, recentViews] = await Promise.all([
      ProjectView.countDocuments({ project: projectId }),
      ProjectView.distinct('user', { project: projectId, user: { $ne: null } }).then((users) => users.length),
      ProjectView.aggregate([
        { $match: { project: project._id, createdAt: { $gte: since } } },
        { $group: { _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } }, views: { $sum: 1 }, uniqueVisitors: { $addToSet: '$user' } } },
        { $sort: { _id: 1 } },
        { $project: { date: '$_id', views: 1, uniqueVisitors: { $size: '$uniqueVisitors' } } },
      ]),
      ProjectView.find({ project: projectId }).populate('user', 'name username avatar').sort({ createdAt: -1 }).limit(50),
    ]);

    return {
      totalViews,
      uniqueVisitors: uniqueVisitors,
      likes: project.likesCount,
      bookmarks: project.bookmarksCount,
      comments: project.commentsCount,
      viewsOverTime,
      recentViews,
    };
  }
}

export const analyticsService = new AnalyticsService();
