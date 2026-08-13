import { Response, NextFunction } from 'express';
import { AuthRequest } from '../middleware/auth.middleware';
import { ArchitectureDiagram } from '../models/ArchitectureDiagram';
import { AppError } from '../middleware/error.middleware';

export class ArchitectureController {
  async create(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const diagram = await ArchitectureDiagram.create({ ...req.body, project: req.params.projectId });
      res.status(201).json({ success: true, data: diagram, message: 'Architecture diagram created' });
    } catch (error) { next(error); }
  }

  async getByProject(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const diagrams = await ArchitectureDiagram.find({ project: req.params.projectId });
      res.json({ success: true, data: diagrams });
    } catch (error) { next(error); }
  }

  async update(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const diagram = await ArchitectureDiagram.findByIdAndUpdate(req.params.id, req.body, { new: true });
      if (!diagram) throw new AppError('Diagram not found', 404, 'NOT_FOUND');
      res.json({ success: true, data: diagram, message: 'Diagram updated' });
    } catch (error) { next(error); }
  }

  async delete(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      await ArchitectureDiagram.findByIdAndDelete(req.params.id);
      res.json({ success: true, data: null, message: 'Diagram deleted' });
    } catch (error) { next(error); }
  }
}

export const architectureController = new ArchitectureController();
