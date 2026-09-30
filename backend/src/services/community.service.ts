import { CommunityPost, ICommunityPost } from '../models/CommunityPost';
import { CommunityComment, ICommunityComment } from '../models/CommunityComment';
import { User } from '../models/User';
import { AppError } from '../middleware/error.middleware';
import { paginate, buildPaginationResponse } from '../utils/helpers';

export class CommunityPostService {
  async create(userId: string, content: string) {
    const post = await CommunityPost.create({ user: userId, content });
    return post.populate('user', 'name username avatar');
  }

  async getAll(page = 1, limit = 20) {
    const { skip, limit: lim } = paginate(page, limit);
    const [posts, total] = await Promise.all([
      CommunityPost.find()
        .populate('user', 'name username avatar')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(lim),
      CommunityPost.countDocuments(),
    ]);
    return { posts, pagination: buildPaginationResponse(total, page, lim) };
  }

  async likePost(postId: string, userId: string) {
    const post = await CommunityPost.findById(postId);
    if (!post) throw new AppError('Post not found', 404, 'POST_NOT_FOUND');
    if (post.likes.includes(userId as any)) throw new AppError('Already liked', 409, 'ALREADY_LIKED');
    post.likes.push(userId as any);
    return post.save();
  }

  async unlikePost(postId: string, userId: string) {
    const post = await CommunityPost.findById(postId);
    if (!post) throw new AppError('Post not found', 404, 'POST_NOT_FOUND');
    post.likes = post.likes.filter((id) => id.toString() !== userId);
    return post.save();
  }
}

export class CommunityCommentService {
  async create(userId: string, postId: string, content: string, parentComment?: string) {
    const post = await CommunityPost.findById(postId);
    if (!post) throw new AppError('Post not found', 404, 'POST_NOT_FOUND');

    const comment = await CommunityComment.create({ user: userId, communityPost: postId, content, parentComment });
    return comment.populate('user', 'name username avatar');
  }

  async getByPost(postId: string, page = 1, limit = 50) {
    const { skip, limit: lim } = paginate(page, limit);
    const [comments, total] = await Promise.all([
      CommunityComment.find({ communityPost: postId, parentComment: null })
        .populate('user', 'name username avatar')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(lim),
      CommunityComment.countDocuments({ communityPost: postId, parentComment: null }),
    ]);
    return { comments, pagination: buildPaginationResponse(total, page, lim) };
  }

  async getReplies(commentId: string) {
    return CommunityComment.find({ parentComment: commentId }).populate('user', 'name username avatar').sort({ createdAt: 1 });
  }

  async update(commentId: string, userId: string, content: string) {
    const comment = await CommunityComment.findById(commentId);
    if (!comment) throw new AppError('Comment not found', 404, 'COMMENT_NOT_FOUND');
    if (comment.user.toString() !== userId) throw new AppError('Not authorized', 403, 'FORBIDDEN');
    comment.content = content;
    return comment.save();
  }

  async delete(commentId: string, userId: string) {
    const comment = await CommunityComment.findById(commentId);
    if (!comment) throw new AppError('Comment not found', 404, 'COMMENT_NOT_FOUND');
    if (comment.user.toString() !== userId) throw new AppError('Not authorized', 403, 'FORBIDDEN');
    await CommunityComment.deleteMany({ parentComment: commentId });
    return comment.deleteOne();
  }

  async likeComment(commentId: string, userId: string) {
    const comment = await CommunityComment.findById(commentId);
    if (!comment) throw new AppError('Comment not found', 404, 'COMMENT_NOT_FOUND');
    if (comment.likes.includes(userId as any)) throw new AppError('Already liked', 409, 'ALREADY_LIKED');
    comment.likes.push(userId as any);
    return comment.save();
  }

  async unlikeComment(commentId: string, userId: string) {
    const comment = await CommunityComment.findById(commentId);
    if (!comment) throw new AppError('Comment not found', 404, 'COMMENT_NOT_FOUND');
    comment.likes = comment.likes.filter((id) => id.toString() !== userId);
    return comment.save();
  }
}

export const communityPostService = new CommunityPostService();
export const communityCommentService = new CommunityCommentService();