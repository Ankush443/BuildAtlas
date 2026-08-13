import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import api from '../services/api';
import { Project, Technology } from '../types';
import { Eye, Heart, Bookmark, Search, Filter, X } from 'lucide-react';

const CATEGORIES = ['All', 'AI/ML', 'SaaS', 'Web', 'Mobile', 'Cybersecurity', 'Developer Tools', 'Data Platform', 'Game', 'API', 'Desktop', 'Other'];
const DIFFICULTIES = ['All', 'Beginner', 'Intermediate', 'Advanced'];
const STATUSES = ['All', 'Production', 'Active', 'Archived'];

export default function DiscoverPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [projects, setProjects] = useState<Project[]>([]);
  const [technologies, setTechnologies] = useState<Technology[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [category, setCategory] = useState(searchParams.get('category') || 'All');
  const [difficulty, setDifficulty] = useState(searchParams.get('difficulty') || 'All');
  const [status, setStatus] = useState(searchParams.get('status') || 'All');
  const [selectedTechs, setSelectedTechs] = useState<string[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const fetchTechs = async () => {
      try {
        const { data } = await api.get('/technologies');
        setTechnologies(data.data);
      } catch {}
    };
    fetchTechs();
  }, []);

  useEffect(() => {
    const fetchProjects = async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams();
        if (search) params.set('search', search);
        if (category !== 'All') params.set('category', category);
        if (difficulty !== 'All') params.set('difficulty', difficulty.toLowerCase());
        if (status !== 'All') params.set('status', status.toLowerCase().replace(' ', '-'));
        params.set('page', page.toString());
        const { data } = await api.get(`/projects?${params}`);
        setProjects(data.data.projects);
        setTotalPages(data.data.pagination.totalPages);
      } catch {} finally { setLoading(false); }
    };
    fetchProjects();
  }, [search, category, difficulty, status, page]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4">Discover Projects</h1>
        <form onSubmit={handleSearch} className="flex gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input type="text" placeholder="Search by name, technology, or description..." value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }} className="input-field pl-10" />
          </div>
        </form>
      </div>

      <div className="flex flex-wrap gap-3 mb-6">
        <div className="flex items-center gap-2"><Filter className="w-4 h-4 text-gray-500" />
          <select value={category} onChange={(e) => { setCategory(e.target.value); setPage(1); }} className="text-sm border border-gray-200 rounded-lg px-3 py-1.5">
            {CATEGORIES.map(c => <option key={c}>{c}</option>)}
          </select>
          <select value={difficulty} onChange={(e) => { setDifficulty(e.target.value); setPage(1); }} className="text-sm border border-gray-200 rounded-lg px-3 py-1.5">
            {DIFFICULTIES.map(d => <option key={d}>{d}</option>)}
          </select>
          <select value={status} onChange={(e) => { setStatus(e.target.value); setPage(1); }} className="text-sm border border-gray-200 rounded-lg px-3 py-1.5">
            {STATUSES.map(s => <option key={s}>{s}</option>)}
          </select>
        </div>
      </div>

      {loading ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map(i => <div key={i} className="card animate-pulse"><div className="h-4 bg-gray-200 rounded w-3/4 mb-4" /><div className="h-3 bg-gray-200 rounded w-full mb-2" /><div className="h-3 bg-gray-200 rounded w-2/3" /></div>)}
        </div>
      ) : projects.length === 0 ? (
        <div className="text-center py-20"><p className="text-gray-500 text-lg">No projects found</p></div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map(project => (
            <Link key={project._id} to={`/projects/${project.slug}`} className="card hover:shadow-lg transition-shadow group">
              {project.coverImage && <img src={project.coverImage} alt={project.name} className="w-full h-40 object-cover rounded-lg mb-4" />}
              <div className="flex items-center gap-2 mb-3">
                <span className="text-xs font-medium px-2 py-1 bg-atlas-50 text-atlas-700 rounded">{project.category}</span>
                <span className="text-xs font-medium px-2 py-1 bg-gray-100 text-gray-600 rounded">{project.difficulty}</span>
              </div>
              <h3 className="font-semibold text-lg mb-2 group-hover:text-atlas-600 transition-colors">{project.name}</h3>
              <p className="text-gray-600 text-sm mb-4 line-clamp-2">{project.shortDescription}</p>
              <div className="flex items-center gap-4 text-sm text-gray-500">
                <span className="flex items-center gap-1"><Eye className="w-4 h-4" /> {project.views}</span>
                <span className="flex items-center gap-1"><Heart className="w-4 h-4" /> {project.likesCount}</span>
                <span className="flex items-center gap-1"><Bookmark className="w-4 h-4" /> {project.bookmarksCount}</span>
              </div>
              <div className="mt-3 flex items-center gap-2">
                {project.owner.avatar ? <img src={project.owner.avatar} alt="" className="w-5 h-5 rounded-full" /> : <div className="w-5 h-5 bg-atlas-100 text-atlas-700 rounded-full flex items-center justify-center text-xs">{project.owner.name[0]}</div>}
                <span className="text-sm text-gray-600">{project.owner.name}</span>
              </div>
            </Link>
          ))}
        </div>
      )}

      {totalPages > 1 && (
        <div className="flex justify-center gap-2 mt-8">
          <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className="btn-secondary text-sm">Previous</button>
          <span className="flex items-center px-4 text-sm text-gray-600">Page {page} of {totalPages}</span>
          <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages} className="btn-secondary text-sm">Next</button>
        </div>
      )}
    </div>
  );
}
