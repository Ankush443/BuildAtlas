import { Like } from '../models/Like';
import { Project } from '../models/Project';
import { Notification } from '../models/Notification';
import { AppError } from '../middleware/error.middleware';

export class LikeService {
  async like(userId: string, projectId: string) {
    const project = await Project.findById(projectId);
    if (!project) throw new AppError('Project not found', 404, 'PROJECT_NOT_FOUND');

    const existing = await Like.findOne({ user: userId, project: projectId });
    if (existing) throw new AppError('Already liked', 409, 'ALREADY_LIKED');

    await Like.create({ user: userId, project: projectId });
    await Project.findByIdAndUpdate(projectId, { $inc: { likesCount: 1 } });

    if (project.owner.toString() !== userId) {
      await Notification.create({
        recipient: project.owner,
        sender: userId,
        type: 'like',
        project: projectId,
        message: 'liked your project',
      });
    }
    return { message: 'Liked' };
  }

  async unlike(userId: string, projectId: string) {
    const result = await Like.findOneAndDelete({ user: userId, project: projectId });
    if (!result) throw new AppError('Not liked', 404, 'NOT_LIKED');
    await Project.findByIdAndUpdate(projectId, { $inc: { likesCount: -1 } });
    return { message: 'Unliked' };
  }

  async hasLiked(userId: string, projectId: string): Promise<boolean> {
    const like = await Like.findOne({ user: userId, project: projectId });
    return !!like;
  }
}

export const likeService = new LikeService();
