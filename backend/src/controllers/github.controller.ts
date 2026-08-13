import { Response, NextFunction } from 'express';
import { AuthRequest } from '../middleware/auth.middleware';
import { githubService } from '../services/github.service';

export class GitHubController {
  async getRepositories(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const repos = await githubService.getRepositories(req.user!._id.toString(), req.body.accessToken);
      res.json({ success: true, data: repos });
    } catch (error) { next(error); }
  }

  async importFromGitHub(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const projectData = await githubService.importFromGitHub(req.user!._id.toString(), req.body.repoId);
      res.json({ success: true, data: projectData, message: 'Repository imported' });
    } catch (error) { next(error); }
  }
}

export const githubController = new GitHubController();
