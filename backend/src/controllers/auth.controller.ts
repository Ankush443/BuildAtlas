import { Response, NextFunction } from 'express';
import { AuthRequest } from '../middleware/auth.middleware';
import { authService } from '../services/auth.service';

export class AuthController {
  async register(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { email, password, name, username } = req.body;
      const result = await authService.register({ email, password, name, username });
      res.cookie('refreshToken', result.refreshToken, { httpOnly: true, secure: true, sameSite: 'strict', maxAge: 7 * 24 * 60 * 60 * 1000 });
      res.status(201).json({ success: true, data: { user: result.user, accessToken: result.accessToken }, message: 'Registration successful' });
    } catch (error) {
      next(error);
    }
  }

  async login(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { email, password } = req.body;
      const result = await authService.login(email, password);
      res.cookie('refreshToken', result.refreshToken, { httpOnly: true, secure: true, sameSite: 'strict', maxAge: 7 * 24 * 60 * 60 * 1000 });
      res.json({ success: true, data: { user: result.user, accessToken: result.accessToken }, message: 'Login successful' });
    } catch (error) {
      next(error);
    }
  }

  async logout(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      await authService.logout(req.user!._id.toString());
      res.clearCookie('refreshToken');
      res.json({ success: true, data: null, message: 'Logout successful' });
    } catch (error) {
      next(error);
    }
  }

  async refreshToken(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const token = req.cookies.refreshToken || req.body.refreshToken;
      const result = await authService.refreshToken(token);
      res.cookie('refreshToken', result.refreshToken, { httpOnly: true, secure: true, sameSite: 'strict', maxAge: 7 * 24 * 60 * 60 * 1000 });
      res.json({ success: true, data: { user: result.user, accessToken: result.accessToken }, message: 'Token refreshed' });
    } catch (error) {
      next(error);
    }
  }

  async getMe(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const user = await authService.getProfile(req.user!._id.toString());
      res.json({ success: true, data: user });
    } catch (error) {
      next(error);
    }
  }

  async updateProfile(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const user = await authService.updateProfile(req.user!._id.toString(), req.body);
      res.json({ success: true, data: user, message: 'Profile updated' });
    } catch (error) {
      next(error);
    }
  }

  async getUserByUsername(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const user = await authService.getUserByUsername(req.params.username);
      res.json({ success: true, data: user });
    } catch (error) {
      next(error);
    }
  }
}

export const authController = new AuthController();
