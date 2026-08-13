import { Project, IProject } from '../models/Project';
import { AppError } from '../middleware/error.middleware';
import { paginate, buildPaginationResponse, createSlug } from '../utils/helpers';

export class ProjectService {
  async create(data: Partial<IProject> & { owner: string }) {
    const slug = createSlug(data.name!);
    const existing = await Project.findOne({ slug });
    if (existing) throw new AppError('A project with a similar name already exists', 409, 'SLUG_CONFLICT');
    return Project.create({ ...data, slug });
  }

  async getBySlug(slug: string) {
    const project = await Project.findOne({ slug }).populate('owner', 'name username avatar');
    if (!project) throw new AppError('Project not found', 404, 'PROJECT_NOT_FOUND');
    return project;
  }

  async getById(id: string) {
    const project = await Project.findById(id).populate('owner', 'name username avatar');
    if (!project) throw new AppError('Project not found', 404, 'PROJECT_NOT_FOUND');
    return project;
  }

  async update(id: string, userId: string, data: Partial<IProject>) {
    const project = await Project.findById(id);
    if (!project) throw new AppError('Project not found', 404, 'PROJECT_NOT_FOUND');
    if (project.owner.toString() !== userId) throw new AppError('Not authorized', 403, 'FORBIDDEN');
    if (data.name && data.name !== project.name) {
      (data as any).slug = createSlug(data.name);
    }
    return Project.findByIdAndUpdate(id, data, { new: true, runValidators: true });
  }

  async delete(id: string, userId: string) {
    const project = await Project.findById(id);
    if (!project) throw new AppError('Project not found', 404, 'PROJECT_NOT_FOUND');
    if (project.owner.toString() !== userId) throw new AppError('Not authorized', 403, 'FORBIDDEN');
    await Project.findByIdAndDelete(id);
  }

  async publish(id: string, userId: string) {
    const project = await Project.findById(id);
    if (!project) throw new AppError('Project not found', 404, 'PROJECT_NOT_FOUND');
    if (project.owner.toString() !== userId) throw new AppError('Not authorized', 403, 'FORBIDDEN');
    project.visibility = 'public';
    project.publishedAt = new Date();
    return project.save();
  }

  async unpublish(id: string, userId: string) {
    const project = await Project.findById(id);
    if (!project) throw new AppError('Project not found', 404, 'PROJECT_NOT_FOUND');
    if (project.owner.toString() !== userId) throw new AppError('Not authorized', 403, 'FORBIDDEN');
    project.visibility = 'draft';
    return project.save();
  }

  async list(query: { page?: number; limit?: number; category?: string; projectType?: string; difficulty?: string; status?: string; sort?: string; search?: string }) {
    const { page = 1, limit = 20, category, projectType, difficulty, status, sort = '-createdAt', search } = query;
    const filter: any = { visibility: 'public' };
    if (category) filter.category = category;
    if (projectType) filter.projectType = projectType;
    if (difficulty) filter.difficulty = difficulty;
    if (status) filter.status = status;
    if (search) filter.$text = { $search: search };

    const { skip, limit: lim } = paginate(page, limit);
    const [projects, total] = await Promise.all([
      Project.find(filter).populate('owner', 'name username avatar').sort(sort).skip(skip).limit(lim),
      Project.countDocuments(filter),
    ]);
    return { projects, pagination: buildPaginationResponse(total, page, lim) };
  }

  async getTrending() {
    return Project.find({ visibility: 'public' }).populate('owner', 'name username avatar').sort({ views: -1, likesCount: -1 }).limit(20);
  }

  async getRecent() {
    return Project.find({ visibility: 'public' }).populate('owner', 'name username avatar').sort({ createdAt: -1 }).limit(20);
  }

  async getByUser(userId: string) {
    return Project.find({ owner: userId }).sort({ createdAt: -1 });
  }

  async incrementViews(id: string) {
    await Project.findByIdAndUpdate(id, { $inc: { views: 1 } });
  }
}

export const projectService = new ProjectService();
