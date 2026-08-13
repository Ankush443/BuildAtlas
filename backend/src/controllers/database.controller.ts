import { Response, NextFunction } from 'express';
import { AuthRequest } from '../middleware/auth.middleware';
import { DatabaseSchema } from '../models/DatabaseSchema';
import { AppError } from '../middleware/error.middleware';

export class DatabaseController {
  async create(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const schema = await DatabaseSchema.create({ ...req.body, project: req.params.projectId });
      res.status(201).json({ success: true, data: schema, message: 'Database schema created' });
    } catch (error) { next(error); }
  }

  async getByProject(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const schemas = await DatabaseSchema.find({ project: req.params.projectId });
      res.json({ success: true, data: schemas });
    } catch (error) { next(error); }
  }

  async update(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const schema = await DatabaseSchema.findByIdAndUpdate(req.params.id, req.body, { new: true });
      if (!schema) throw new AppError('Schema not found', 404, 'NOT_FOUND');
      res.json({ success: true, data: schema, message: 'Schema updated' });
    } catch (error) { next(error); }
  }

  async delete(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      await DatabaseSchema.findByIdAndDelete(req.params.id);
      res.json({ success: true, data: null, message: 'Schema deleted' });
    } catch (error) { next(error); }
  }
}

export const databaseController = new DatabaseController();
