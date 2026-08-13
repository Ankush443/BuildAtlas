import axios from 'axios';
import { GitHubRepository } from '../models/GitHubRepository';
import { AppError } from '../middleware/error.middleware';

export class GitHubService {
  private api = axios.create({ baseURL: 'https://api.github.com', headers: { Accept: 'application/vnd.github.v3+json' } });

  async getRepositories(userId: string, accessToken: string) {
    const response = await this.api.get('/user/repos', {
      headers: { Authorization: `Bearer ${accessToken}` },
      params: { per_page: 100, sort: 'updated' },
    });

    const repos = response.data;
    for (const repo of repos) {
      await GitHubRepository.findOneAndUpdate(
        { user: userId, githubId: repo.id },
        {
          user: userId,
          githubId: repo.id,
          name: repo.name,
          fullName: repo.full_name,
          description: repo.description || '',
          htmlUrl: repo.html_url,
          stargazersCount: repo.stargazers_count,
          forksCount: repo.forks_count,
          language: repo.language || '',
          topics: repo.topics || [],
          license: repo.license?.spdx_id || '',
          defaultBranch: repo.default_branch,
          lastSyncedAt: new Date(),
        },
        { upsert: true }
      );
    }

    return GitHubRepository.find({ user: userId }).sort({ lastSyncedAt: -1 });
  }

  async importFromGitHub(userId: string, repoId: string) {
    const repo = await GitHubRepository.findOne({ _id: repoId, user: userId });
    if (!repo) throw new AppError('Repository not found', 404, 'REPO_NOT_FOUND');

    return {
      name: repo.name,
      shortDescription: repo.description,
      repositoryUrl: repo.htmlUrl,
      license: repo.license,
    };
  }
}

export const githubService = new GitHubService();
