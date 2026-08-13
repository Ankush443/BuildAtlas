import { Response, NextFunction } from 'express';
import { AuthRequest } from '../middleware/auth.middleware';
import { projectService } from '../services/project.service';

export class ProjectController {
  async create(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const project = await projectService.create({ ...req.body, owner: req.user!._id.toString() });
      res.status(201).json({ success: true, data: project, message: 'Project created' });
    } catch (error) { next(error); }
  }

  async getBySlug(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const project = await projectService.getBySlug(req.params.slug);
      await projectService.incrementViews(project._id.toString());
      res.json({ success: true, data: project });
    } catch (error) { next(error); }
  }

  async update(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const project = await projectService.update(req.params.id, req.user!._id.toString(), req.body);
      res.json({ success: true, data: project, message: 'Project updated' });
    } catch (error) { next(error); }
  }

  async delete(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      await projectService.delete(req.params.id, req.user!._id.toString());
      res.json({ success: true, data: null, message: 'Project deleted' });
    } catch (error) { next(error); }
  }

  async publish(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const project = await projectService.publish(req.params.id, req.user!._id.toString());
      res.json({ success: true, data: project, message: 'Project published' });
    } catch (error) { next(error); }
  }

  async unpublish(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const project = await projectService.unpublish(req.params.id, req.user!._id.toString());
      res.json({ success: true, data: project, message: 'Project unpublished' });
    } catch (error) { next(error); }
  }

  async list(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const result = await projectService.list(req.query as any);
      res.json({ success: true, data: result });
    } catch (error) { next(error); }
  }

  async getTrending(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const projects = await projectService.getTrending();
      res.json({ success: true, data: projects });
    } catch (error) { next(error); }
  }

  async getRecent(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const projects = await projectService.getRecent();
      res.json({ success: true, data: projects });
    } catch (error) { next(error); }
  }

  async getMyProjects(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const projects = await projectService.getByUser(req.user!._id.toString());
      res.json({ success: true, data: projects });
    } catch (error) { next(error); }
  }
}

export const projectController = new ProjectController();
