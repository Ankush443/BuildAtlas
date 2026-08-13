import { Report } from '../models/Report';
import { User } from '../models/User';
import { Project } from '../models/Project';
import { Comment } from '../models/Comment';
import { AppError } from '../middleware/error.middleware';
import { paginate, buildPaginationResponse } from '../utils/helpers';

export class AdminService {
  async getUsers(page = 1, limit = 20, search?: string) {
    const filter: any = {};
    if (search) filter.$or = [{ name: { $regex: search, $options: 'i' } }, { username: { $regex: search, $options: 'i' } }, { email: { $regex: search, $options: 'i' } }];

    const { skip, limit: lim } = paginate(page, limit);
    const [users, total] = await Promise.all([User.find(filter).sort({ createdAt: -1 }).skip(skip).limit(lim), User.countDocuments(filter)]);
    return { users, pagination: buildPaginationResponse(total, page, lim) };
  }

  async getProjects(page = 1, limit = 20, search?: string) {
    const filter: any = {};
    if (search) filter.$text = { $search: search };

    const { skip, limit: lim } = paginate(page, limit);
    const [projects, total] = await Promise.all([Project.find(filter).populate('owner', 'name username').sort({ createdAt: -1 }).skip(skip).limit(lim), Project.countDocuments(filter)]);
    return { projects, pagination: buildPaginationResponse(total, page, lim) };
  }

  async suspendUser(userId: string) {
    await User.findByIdAndUpdate(userId, { role: 'suspended' });
  }

  async hideProject(projectId: string) {
    await Project.findByIdAndUpdate(projectId, { visibility: 'private' });
  }

  async deleteComment(commentId: string) {
    await Comment.findByIdAndDelete(commentId);
  }

  async getReports(page = 1, limit = 20, status?: string) {
    const filter: any = {};
    if (status) filter.status = status;

    const { skip, limit: lim } = paginate(page, limit);
    const [reports, total] = await Promise.all([Report.find(filter).populate('reporter', 'name username').sort({ createdAt: -1 }).skip(skip).limit(lim), Report.countDocuments(filter)]);
    return { reports, pagination: buildPaginationResponse(total, page, lim) };
  }

  async resolveReport(reportId: string, adminNote: string) {
    return Report.findByIdAndUpdate(reportId, { status: 'resolved', adminNote }, { new: true });
  }

  async rejectReport(reportId: string, adminNote: string) {
    return Report.findByIdAndUpdate(reportId, { status: 'rejected', adminNote }, { new: true });
  }

  async getAnalytics() {
    const [totalUsers, activeUsers, totalProjects, publishedProjects, totalComments, totalLikes] = await Promise.all([
      User.countDocuments(),
      User.countDocuments({ updatedAt: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) } }),
      Project.countDocuments(),
      Project.countDocuments({ visibility: 'public' }),
      (await import('../models/Comment')).Comment.countDocuments(),
      (await import('../models/Like')).Like.countDocuments(),
    ]);
    return { totalUsers, activeUsers, totalProjects, publishedProjects, totalComments, totalLikes };
  }
}

export const adminService = new AdminService();
