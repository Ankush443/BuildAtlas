import { User, IUser } from '../models/User';
import { AppError } from '../middleware/error.middleware';
import { generateTokens, verifyRefreshToken } from '../utils/helpers';

export class AuthService {
  async register(data: { email: string; password: string; name: string; username: string }) {
    const existingUser = await User.findOne({ $or: [{ email: data.email }, { username: data.username }] });
    if (existingUser) {
      throw new AppError(existingUser.email === data.email ? 'Email already in use' : 'Username already taken', 409, 'USER_EXISTS');
    }
    const user = await User.create(data);
    const tokens = generateTokens(user._id.toString());
    await User.findByIdAndUpdate(user._id, { refreshToken: tokens.refreshToken });
    return { user, ...tokens };
  }

  async login(email: string, password: string) {
    const user = await User.findOne({ email }).select('+password');
    if (!user || !(await user.comparePassword(password))) {
      throw new AppError('Invalid email or password', 401, 'INVALID_CREDENTIALS');
    }
    const tokens = generateTokens(user._id.toString());
    await User.findByIdAndUpdate(user._id, { refreshToken: tokens.refreshToken });
    return { user, ...tokens };
  }

  async logout(userId: string) {
    await User.findByIdAndUpdate(userId, { refreshToken: null });
  }

  async refreshToken(token: string) {
    const decoded = verifyRefreshToken(token);
    const user = await User.findById(decoded.userId).select('+refreshToken');
    if (!user || user.refreshToken !== token) {
      throw new AppError('Invalid refresh token', 401, 'INVALID_REFRESH_TOKEN');
    }
    const tokens = generateTokens(user._id.toString());
    await User.findByIdAndUpdate(user._id, { refreshToken: tokens.refreshToken });
    return { user, ...tokens };
  }

  async getProfile(userId: string) {
    const user = await User.findById(userId);
    if (!user) throw new AppError('User not found', 404, 'USER_NOT_FOUND');
    return user;
  }

  async updateProfile(userId: string, data: Partial<IUser>) {
    const allowedFields = ['name', 'bio', 'location', 'website', 'github', 'linkedin', 'avatar', 'skills'];
    const updates: any = {};
    for (const field of allowedFields) {
      if (data[field as keyof IUser] !== undefined) {
        updates[field] = data[field as keyof IUser];
      }
    }
    const user = await User.findByIdAndUpdate(userId, updates, { new: true, runValidators: true });
    if (!user) throw new AppError('User not found', 404, 'USER_NOT_FOUND');
    return user;
  }

  async getUserByUsername(username: string) {
    const user = await User.findOne({ username });
    if (!user) throw new AppError('User not found', 404, 'USER_NOT_FOUND');
    return user;
  }
}

export const authService = new AuthService();
