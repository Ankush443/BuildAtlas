import { Comment, IComment } from '../models/Comment';
import { Project } from '../models/Project';
import { Notification } from '../models/Notification';
import { AppError } from '../middleware/error.middleware';
import { paginate, buildPaginationResponse } from '../utils/helpers';

export class CommentService {
  async create(userId: string, projectId: string, data: { content: string; parentComment?: string }) {
    const project = await Project.findById(projectId);
    if (!project) throw new AppError('Project not found', 404, 'PROJECT_NOT_FOUND');

    const comment = await Comment.create({ user: userId, project: projectId, ...data });
    await Project.findByIdAndUpdate(projectId, { $inc: { commentsCount: 1 } });

    if (data.parentComment) {
      const parent = await Comment.findById(data.parentComment);
      if (parent && parent.user.toString() !== userId) {
        await Notification.create({ recipient: parent.user, sender: userId, type: 'comment_reply', project: projectId, comment: comment._id, message: 'replied to your comment' });
      }
    } else if (project.owner.toString() !== userId) {
      await Notification.create({ recipient: project.owner, sender: userId, type: 'comment', project: projectId, comment: comment._id, message: 'commented on your project' });
    }

    return comment.populate('user', 'name username avatar');
  }

  async getByProject(projectId: string, page = 1, limit = 50) {
    const { skip, limit: lim } = paginate(page, limit);
    const [comments, total] = await Promise.all([
      Comment.find({ project: projectId, parentComment: null }).populate('user', 'name username avatar').sort({ createdAt: -1 }).skip(skip).limit(lim),
      Comment.countDocuments({ project: projectId, parentComment: null }),
    ]);
    return { comments, pagination: buildPaginationResponse(total, page, lim) };
  }

  async getReplies(commentId: string) {
    return Comment.find({ parentComment: commentId }).populate('user', 'name username avatar').sort({ createdAt: 1 });
  }

  async update(commentId: string, userId: string, content: string) {
    const comment = await Comment.findById(commentId);
    if (!comment) throw new AppError('Comment not found', 404, 'COMMENT_NOT_FOUND');
    if (comment.user.toString() !== userId) throw new AppError('Not authorized', 403, 'FORBIDDEN');
    comment.content = content;
    return comment.save();
  }

  async delete(commentId: string, userId: string) {
    const comment = await Comment.findById(commentId);
    if (!comment) throw new AppError('Comment not found', 404, 'COMMENT_NOT_FOUND');
    if (comment.user.toString() !== userId) throw new AppError('Not authorized', 403, 'FORBIDDEN');
    await Comment.deleteMany({ parentComment: commentId });
    await Comment.findByIdAndDelete(commentId);
    await Project.findByIdAndUpdate(comment.project, { $inc: { commentsCount: -1 } });
  }

  async likeComment(commentId: string, userId: string) {
    const comment = await Comment.findById(commentId);
    if (!comment) throw new AppError('Comment not found', 404, 'COMMENT_NOT_FOUND');
    if (comment.likes.includes(userId as any)) throw new AppError('Already liked', 409, 'ALREADY_LIKED');
    comment.likes.push(userId as any);
    return comment.save();
  }

  async unlikeComment(commentId: string, userId: string) {
    const comment = await Comment.findById(commentId);
    if (!comment) throw new AppError('Comment not found', 404, 'COMMENT_NOT_FOUND');
    comment.likes = comment.likes.filter((id) => id.toString() !== userId);
    return comment.save();
  }
}

export const commentService = new CommentService();
