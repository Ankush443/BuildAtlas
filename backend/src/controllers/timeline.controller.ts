import { Response, NextFunction } from 'express';
import { AuthRequest } from '../middleware/auth.middleware';
import { TimelineEvent } from '../models/TimelineEvent';
import { AppError } from '../middleware/error.middleware';

export class TimelineController {
  async create(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const event = await TimelineEvent.create({ ...req.body, project: req.params.projectId });
      res.status(201).json({ success: true, data: event, message: 'Timeline event created' });
    } catch (error) { next(error); }
  }

  async getByProject(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const events = await TimelineEvent.find({ project: req.params.projectId }).sort({ date: 1 });
      res.json({ success: true, data: events });
    } catch (error) { next(error); }
  }

  async update(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const event = await TimelineEvent.findByIdAndUpdate(req.params.id, req.body, { new: true });
      if (!event) throw new AppError('Event not found', 404, 'NOT_FOUND');
      res.json({ success: true, data: event, message: 'Event updated' });
    } catch (error) { next(error); }
  }

  async delete(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      await TimelineEvent.findByIdAndDelete(req.params.id);
      res.json({ success: true, data: null, message: 'Event deleted' });
    } catch (error) { next(error); }
  }
}

export const timelineController = new TimelineController();
