import { Response, NextFunction } from 'express';
import { AuthRequest } from '../middleware/auth.middleware';
import { Lesson } from '../models/Lesson';
import { AppError } from '../middleware/error.middleware';

export class LessonController {
  async create(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const lesson = await Lesson.create({ ...req.body, project: req.params.projectId });
      res.status(201).json({ success: true, data: lesson, message: 'Lesson created' });
    } catch (error) { next(error); }
  }

  async getByProject(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const lessons = await Lesson.find({ project: req.params.projectId }).sort({ createdAt: -1 });
      res.json({ success: true, data: lessons });
    } catch (error) { next(error); }
  }

  async update(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const lesson = await Lesson.findByIdAndUpdate(req.params.id, req.body, { new: true });
      if (!lesson) throw new AppError('Lesson not found', 404, 'NOT_FOUND');
      res.json({ success: true, data: lesson, message: 'Lesson updated' });
    } catch (error) { next(error); }
  }

  async delete(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      await Lesson.findByIdAndDelete(req.params.id);
      res.json({ success: true, data: null, message: 'Lesson deleted' });
    } catch (error) { next(error); }
  }
}

export const lessonController = new LessonController();
