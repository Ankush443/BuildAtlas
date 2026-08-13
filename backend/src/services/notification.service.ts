import { Notification } from '../models/Notification';
import { paginate, buildPaginationResponse } from '../utils/helpers';

export class NotificationService {
  async getByUser(userId: string, page = 1, limit = 20) {
    const { skip, limit: lim } = paginate(page, limit);
    const [notifications, total, unreadCount] = await Promise.all([
      Notification.find({ recipient: userId }).populate('sender', 'name username avatar').populate('project', 'name slug').sort({ createdAt: -1 }).skip(skip).limit(lim),
      Notification.countDocuments({ recipient: userId }),
      Notification.countDocuments({ recipient: userId, read: false }),
    ]);
    return { notifications, pagination: buildPaginationResponse(total, page, lim), unreadCount };
  }

  async markAsRead(userId: string, notificationId: string) {
    await Notification.findOneAndUpdate({ _id: notificationId, recipient: userId }, { read: true });
  }

  async markAllAsRead(userId: string) {
    await Notification.updateMany({ recipient: userId, read: false }, { read: true });
  }

  async getUnreadCount(userId: string): Promise<number> {
    return Notification.countDocuments({ recipient: userId, read: false });
  }
}

export const notificationService = new NotificationService();
