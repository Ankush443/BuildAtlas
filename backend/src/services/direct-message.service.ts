import { DirectMessage, IDirectMessage } from '../models/DirectMessage';
import { User } from '../models/User';
import { AppError } from '../middleware/error.middleware';

export class DirectMessageService {
  async send(senderId: string, recipientId: string, content: string) {
    const recipient = await User.findById(recipientId);
    if (!recipient) throw new AppError('Recipient not found', 404, 'USER_NOT_FOUND');

    const message = await DirectMessage.create({ sender: senderId, recipient: recipientId, content });
    return message.populate('sender', 'name username avatar');
  }

  async getConversations(userId: string) {
    const messages = await DirectMessage.find({
      $or: [{ sender: userId }, { recipient: userId }],
    })
      .populate('sender', 'name username avatar')
      .populate('recipient', 'name username avatar')
      .sort({ createdAt: -1 });
    return messages;
  }

  async getMessages(userId: string, otherUserId: string) {
    const messages = await DirectMessage.find({
      $or: [
        { sender: userId, recipient: otherUserId },
        { sender: otherUserId, recipient: userId },
      ],
    })
      .populate('sender', 'name username avatar')
      .populate('recipient', 'name username avatar')
      .sort({ createdAt: 1 });

    // Mark messages from other user as read
    await DirectMessage.updateMany(
      { sender: otherUserId, recipient: userId, read: false },
      { $set: { read: true } }
    );

    return messages;
  }

  async markAsRead(messageId: string, userId: string) {
    const message = await DirectMessage.findById(messageId);
    if (!message) throw new AppError('Message not found', 404, 'MESSAGE_NOT_FOUND');
    if (message.recipient.toString() !== userId && message.sender.toString() !== userId) {
      throw new AppError('Not authorized', 403, 'FORBIDDEN');
    }
    message.read = true;
    return message.save();
  }
}

export const directMessageService = new DirectMessageService();