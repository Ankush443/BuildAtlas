import { Technology, ITechnology } from '../models/Technology';
import { AppError } from '../middleware/error.middleware';

export class TechnologyService {
  async create(data: Partial<ITechnology>) {
    const existing = await Technology.findOne({ name: data.name });
    if (existing) throw new AppError('Technology already exists', 409, 'TECH_EXISTS');
    return Technology.create(data);
  }

  async getAll(category?: string) {
    const filter: any = {};
    if (category) filter.category = category;
    return Technology.find(filter).sort({ name: 1 });
  }

  async getById(id: string) {
    const tech = await Technology.findById(id);
    if (!tech) throw new AppError('Technology not found', 404, 'TECH_NOT_FOUND');
    return tech;
  }

  async search(query: string) {
    return Technology.find({ name: { $regex: query, $options: 'i' } }).limit(20);
  }
}

export const technologyService = new TechnologyService();
