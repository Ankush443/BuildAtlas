import { Response, NextFunction } from 'express';
import { AuthRequest } from '../middleware/auth.middleware';
import { technologyService } from '../services/technology.service';
import { ProjectTechnology } from '../models/ProjectTechnology';
import { AppError } from '../middleware/error.middleware';

export class TechnologyController {
  async create(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const tech = await technologyService.create(req.body);
      res.status(201).json({ success: true, data: tech, message: 'Technology created' });
    } catch (error) { next(error); }
  }

  async getAll(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const techs = await technologyService.getAll(req.query.category as string);
      res.json({ success: true, data: techs });
    } catch (error) { next(error); }
  }

  async search(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const techs = await technologyService.search(req.query.q as string);
      res.json({ success: true, data: techs });
    } catch (error) { next(error); }
  }

  async addToProject(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { technologyId, category, version, isPrimary, description } = req.body;
      const projectTech = await ProjectTechnology.create({ project: req.params.projectId, technology: technologyId, category, version, isPrimary, description });
      res.status(201).json({ success: true, data: projectTech, message: 'Technology added to project' });
    } catch (error) { next(error); }
  }

  async removeFromProject(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      await ProjectTechnology.findOneAndDelete({ project: req.params.projectId, technology: req.params.techId });
      res.json({ success: true, data: null, message: 'Technology removed' });
    } catch (error) { next(error); }
  }

  async getProjectTechs(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const techs = await ProjectTechnology.find({ project: req.params.projectId }).populate('technology');
      res.json({ success: true, data: techs });
    } catch (error) { next(error); }
  }
}

export const technologyController = new TechnologyController();
