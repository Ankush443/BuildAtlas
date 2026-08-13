import { Follow } from '../models/Follow';
import { User } from '../models/User';
import { Notification } from '../models/Notification';
import { AppError } from '../middleware/error.middleware';

export class FollowService {
  async follow(followerId: string, followingId: string) {
    if (followerId === followingId) throw new AppError('Cannot follow yourself', 400, 'SELF_FOLLOW');

    const targetUser = await User.findById(followingId);
    if (!targetUser) throw new AppError('User not found', 404, 'USER_NOT_FOUND');

    const existing = await Follow.findOne({ follower: followerId, following: followingId });
    if (existing) throw new AppError('Already following', 409, 'ALREADY_FOLLOWING');

    await Follow.create({ follower: followerId, following: followingId });
    await User.findByIdAndUpdate(followerId, { $addToSet: { following: followingId } });
    await User.findByIdAndUpdate(followingId, { $addToSet: { followers: followerId } });

    await Notification.create({ recipient: followingId, sender: followerId, type: 'follow', message: 'started following you' });
    return { message: 'Followed' };
  }

  async unfollow(followerId: string, followingId: string) {
    const result = await Follow.findOneAndDelete({ follower: followerId, following: followingId });
    if (!result) throw new AppError('Not following', 404, 'NOT_FOLLOWING');
    await User.findByIdAndUpdate(followerId, { $pull: { following: followingId } });
    await User.findByIdAndUpdate(followingId, { $pull: { followers: followerId } });
    return { message: 'Unfollowed' };
  }

  async getFollowers(userId: string) {
    const follows = await Follow.find({ following: userId }).populate('follower', 'name username avatar bio');
    return follows.map((f) => f.follower);
  }

  async getFollowing(userId: string) {
    const follows = await Follow.find({ follower: userId }).populate('following', 'name username avatar bio');
    return follows.map((f) => f.following);
  }

  async isFollowing(followerId: string, followingId: string): Promise<boolean> {
    const follow = await Follow.findOne({ follower: followerId, following: followingId });
    return !!follow;
  }
}

export const followService = new FollowService();
