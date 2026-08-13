import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../features/auth/AuthContext';
import { Project, ArchitectureDiagram, EngineeringDecision, Problem, TimelineEvent, Lesson, Comment as CommentType } from '../types';
import { Eye, Heart, Bookmark, MessageSquare, ExternalLink, Github, Calendar, ArrowLeft } from 'lucide-react';
import toast from 'react-hot-toast';

export default function ProjectPage() {
  const { slug } = useParams();
  const { user } = useAuth();
  const [project, setProject] = useState<Project | null>(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [liked, setLiked] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const { data } = await api.get(`/projects/${slug}`);
        setProject(data.data);
        if (user) {
          const [likeRes, bookmarkRes] = await Promise.all([api.get(`/projects/${data.data._id}/is-liked`), api.get(`/projects/${data.data._id}/is-bookmarked`)]);
          setLiked(likeRes.data.data.liked);
          setBookmarked(bookmarkRes.data.data.bookmarked);
        }
      } catch { toast.error('Project not found'); } finally { setLoading(false); }
    };
    fetchProject();
  }, [slug, user]);

  const toggleLike = async () => {
    if (!user) { toast.error('Please log in'); return; }
    try {
      if (liked) { await api.delete(`/projects/${project!._id}/like`); setLiked(false); setProject(p => p ? { ...p, likesCount: p.likesCount - 1 } : p); }
      else { await api.post(`/projects/${project!._id}/like`); setLiked(true); setProject(p => p ? { ...p, likesCount: p.likesCount + 1 } : p); }
    } catch (err: any) { toast.error(err.response?.data?.error?.message || 'Error'); }
  };

  const toggleBookmark = async () => {
    if (!user) { toast.error('Please log in'); return; }
    try {
      if (bookmarked) { await api.delete(`/projects/${project!._id}/bookmark`); setBookmarked(false); setProject(p => p ? { ...p, bookmarksCount: p.bookmarksCount - 1 } : p); }
      else { await api.post(`/projects/${project!._id}/bookmark`); setBookmarked(true); setProject(p => p ? { ...p, bookmarksCount: p.bookmarksCount + 1 } : p); }
    } catch (err: any) { toast.error(err.response?.data?.error?.message || 'Error'); }
  };

  if (loading) return <div className="max-w-5xl mx-auto px-4 py-8"><div className="animate-pulse space-y-4"><div className="h-8 bg-gray-200 rounded w-1/3" /><div className="h-4 bg-gray-200 rounded w-2/3" /></div></div>;
  if (!project) return <div className="text-center py-20"><p className="text-gray-500">Project not found</p></div>;

  const tabs = ['overview', 'architecture', 'database', 'api-docs', 'decisions', 'problems', 'timeline', 'deployment', 'lessons', 'comments'];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Link to="/discover" className="inline-flex items-center gap-1 text-sm text-gray-600 hover:text-gray-900 mb-6"><ArrowLeft className="w-4 h-4" /> Back to Discover</Link>

      <div className="mb-8">
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs font-medium px-2 py-1 bg-atlas-50 text-atlas-700 rounded">{project.category}</span>
              <span className="text-xs font-medium px-2 py-1 bg-gray-100 text-gray-600 rounded">{project.status}</span>
            </div>
            <h1 className="text-3xl font-bold mb-2">{project.name}</h1>
            <p className="text-gray-600 mb-4">{project.shortDescription}</p>
            <div className="flex items-center gap-4">
              <Link to={`/u/${project.owner.username}`} className="flex items-center gap-2">
                {project.owner.avatar ? <img src={project.owner.avatar} alt="" className="w-8 h-8 rounded-full" /> : <div className="w-8 h-8 bg-atlas-100 text-atlas-700 rounded-full flex items-center justify-center font-medium text-sm">{project.owner.name[0]}</div>}
                <span className="text-sm font-medium">{project.owner.name}</span>
              </Link>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={toggleLike} className={`flex items-center gap-1.5 px-3 py-2 rounded-lg border text-sm font-medium transition-colors ${liked ? 'bg-red-50 border-red-200 text-red-600' : 'border-gray-200 hover:bg-gray-50'}`}>
              <Heart className={`w-4 h-4 ${liked ? 'fill-current' : ''}`} /> {project.likesCount}
            </button>
            <button onClick={toggleBookmark} className={`flex items-center gap-1.5 px-3 py-2 rounded-lg border text-sm font-medium transition-colors ${bookmarked ? 'bg-yellow-50 border-yellow-200 text-yellow-600' : 'border-gray-200 hover:bg-gray-50'}`}>
              <Bookmark className={`w-4 h-4 ${bookmarked ? 'fill-current' : ''}`} /> {project.bookmarksCount}
            </button>
            {project.repositoryUrl && <a href={project.repositoryUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-gray-200 hover:bg-gray-50 text-sm font-medium"><Github className="w-4 h-4" /> Code</a>}
            {project.liveUrl && <a href={project.liveUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-gray-200 hover:bg-gray-50 text-sm font-medium"><ExternalLink className="w-4 h-4" /> Live</a>}
          </div>
        </div>
        <div className="flex items-center gap-6 mt-4 text-sm text-gray-500">
          <span className="flex items-center gap-1"><Eye className="w-4 h-4" /> {project.views} views</span>
          <span className="flex items-center gap-1"><MessageSquare className="w-4 h-4" /> {project.commentsCount} comments</span>
          {project.publishedAt && <span className="flex items-center gap-1"><Calendar className="w-4 h-4" /> Published {new Date(project.publishedAt).toLocaleDateString()}</span>}
        </div>
      </div>

      <div className="border-b border-gray-200 mb-8 overflow-x-auto">
        <div className="flex gap-1 min-w-max">
          {tabs.map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)} className={`px-4 py-2 text-sm font-medium capitalize whitespace-nowrap border-b-2 transition-colors ${activeTab === tab ? 'border-atlas-600 text-atlas-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}>
              {tab.replace('-', ' ')}
            </button>
          ))}
        </div>
      </div>

      <div className="min-h-[400px]">
        {activeTab === 'overview' && (
          <div className="prose max-w-none">
            {project.fullDescription ? <div dangerouslySetInnerHTML={{ __html: project.fullDescription }} /> : <p className="text-gray-500">No detailed description yet.</p>}
          </div>
        )}
        {activeTab === 'architecture' && <ArchitectureSection projectId={project._id} />}
        {activeTab === 'database' && <DatabaseSection projectId={project._id} />}
        {activeTab === 'api-docs' && <ApiDocsSection projectId={project._id} />}
        {activeTab === 'decisions' && <DecisionsSection projectId={project._id} />}
        {activeTab === 'problems' && <ProblemsSection projectId={project._id} />}
        {activeTab === 'timeline' && <TimelineSection projectId={project._id} />}
        {activeTab === 'deployment' && <DeploymentSection projectId={project._id} />}
        {activeTab === 'lessons' && <LessonsSection projectId={project._id} />}
        {activeTab === 'comments' && <CommentsSection projectId={project._id} />}
      </div>
    </div>
  );
}

function ArchitectureSection({ projectId }: { projectId: string }) {
  const [diagrams, setDiagrams] = useState<any[]>([]);
  useEffect(() => { api.get(`/projects/${projectId}/architecture`).then(d => setDiagrams(d.data.data)).catch(() => {}); }, [projectId]);
  if (!diagrams.length) return <p className="text-gray-500">No architecture diagrams yet.</p>;
  return <div className="space-y-6">{diagrams.map(d => <div key={d._id} className="card"><h3 className="font-semibold mb-2">{d.title}</h3><p className="text-sm text-gray-600 mb-4">{d.description}</p><div className="bg-gray-50 rounded-lg p-4 min-h-[200px] flex items-center justify-center text-gray-400 text-sm">Interactive diagram (React Flow)</div></div>)}</div>;
}

function DatabaseSection({ projectId }: { projectId: string }) {
  const [schemas, setSchemas] = useState<any[]>([]);
  useEffect(() => { api.get(`/projects/${projectId}/database`).then(d => setSchemas(d.data.data)).catch(() => {}); }, [projectId]);
  if (!schemas.length) return <p className="text-gray-500">No database documentation yet.</p>;
  return <div className="space-y-6">{schemas.map(s => <div key={s._id} className="card"><h3 className="font-semibold mb-2">{s.name}</h3><p className="text-sm text-gray-600 mb-4">{s.description}</p><pre className="bg-gray-50 rounded-lg p-4 text-sm overflow-x-auto">{JSON.stringify(s.collections, null, 2)}</pre></div>)}</div>;
}

function ApiDocsSection({ projectId }: { projectId: string }) {
  const [endpoints, setEndpoints] = useState<any[]>([]);
  useEffect(() => { api.get(`/projects/${projectId}/api-docs`).then(d => setEndpoints(d.data.data)).catch(() => {}); }, [projectId]);
  if (!endpoints.length) return <p className="text-gray-500">No API documentation yet.</p>;
  const methodColors: Record<string, string> = { GET: 'bg-green-100 text-green-700', POST: 'bg-blue-100 text-blue-700', PUT: 'bg-yellow-100 text-yellow-700', PATCH: 'bg-orange-100 text-orange-700', DELETE: 'bg-red-100 text-red-700' };
  return <div className="space-y-3">{endpoints.map(e => <div key={e._id} className="card flex items-start gap-4"><span className={`text-xs font-bold px-2 py-1 rounded ${methodColors[e.method]}`}>{e.method}</span><div className="flex-1"><code className="text-sm font-mono">{e.endpoint}</code><p className="text-sm text-gray-600 mt-1">{e.description}</p></div></div>)}</div>;
}

function DecisionsSection({ projectId }: { projectId: string }) {
  const [decisions, setDecisions] = useState<any[]>([]);
  useEffect(() => { api.get(`/projects/${projectId}/decisions`).then(d => setDecisions(d.data.data)).catch(() => {}); }, [projectId]);
  if (!decisions.length) return <p className="text-gray-500">No engineering decisions documented yet.</p>;
  return <div className="space-y-4">{decisions.map(d => <div key={d._id} className="card"><div className="flex items-center gap-2 mb-2"><h3 className="font-semibold">{d.title}</h3><span className="text-xs px-2 py-0.5 bg-gray-100 rounded">{d.status}</span></div><p className="text-sm text-gray-600 mb-2"><strong>Problem:</strong> {d.problem}</p><p className="text-sm text-gray-600 mb-2"><strong>Decision:</strong> {d.selectedSolution}</p><p className="text-sm text-gray-600"><strong>Reason:</strong> {d.reason}</p></div>)}</div>;
}

function ProblemsSection({ projectId }: { projectId: string }) {
  const [problems, setProblems] = useState<any[]>([]);
  useEffect(() => { api.get(`/projects/${projectId}/problems`).then(d => setProblems(d.data.data)).catch(() => {}); }, [projectId]);
  if (!problems.length) return <p className="text-gray-500">No problems documented yet.</p>;
  return <div className="space-y-4">{problems.map(p => <div key={p._id} className="card"><h3 className="font-semibold mb-2">{p.title}</h3><p className="text-sm text-gray-600 mb-2">{p.description}</p>{p.finalSolution && <p className="text-sm text-green-700"><strong>Solution:</strong> {p.finalSolution}</p>}</div>)}</div>;
}

function TimelineSection({ projectId }: { projectId: string }) {
  const [events, setEvents] = useState<any[]>([]);
  useEffect(() => { api.get(`/projects/${projectId}/timeline`).then(d => setEvents(d.data.data)).catch(() => {}); }, [projectId]);
  if (!events.length) return <p className="text-gray-500">No timeline events yet.</p>;
  return <div className="relative border-l-2 border-gray-200 ml-4 space-y-6">{events.map(e => <div key={e._id} className="relative pl-8"><div className="absolute -left-2 top-1 w-4 h-4 bg-atlas-600 rounded-full border-2 border-white" /><div className="text-xs text-gray-500 mb-1">{new Date(e.date).toLocaleDateString()}</div><h4 className="font-semibold">{e.title}</h4><p className="text-sm text-gray-600">{e.description}</p></div>)}</div>;
}

function DeploymentSection({ projectId }: { projectId: string }) {
  const [deployment, setDeployment] = useState<any>(null);
  useEffect(() => { api.get(`/projects/${projectId}/deployment`).then(d => setDeployment(d.data.data)).catch(() => {}); }, [projectId]);
  if (!deployment) return <p className="text-gray-500">No deployment documentation yet.</p>;
  return <div className="card space-y-3">{Object.entries(deployment).filter(([k]) => !['_id', 'project', '__v', 'diagram'].includes(k)).map(([key, value]) => value ? <div key={key}><span className="text-sm font-medium text-gray-500 capitalize">{key.replace(/([A-Z])/g, ' $1')}:</span><span className="ml-2 text-sm">{value as string}</span></div> : null)}</div>;
}

function LessonsSection({ projectId }: { projectId: string }) {
  const [lessons, setLessons] = useState<any[]>([]);
  useEffect(() => { api.get(`/projects/${projectId}/lessons`).then(d => setLessons(d.data.data)).catch(() => {}); }, [projectId]);
  if (!lessons.length) return <p className="text-gray-500">No lessons documented yet.</p>;
  return <div className="space-y-4">{lessons.map(l => <div key={l._id} className="card"><div className="flex items-center gap-2 mb-2"><h3 className="font-semibold">{l.title}</h3><span className="text-xs px-2 py-0.5 bg-atlas-50 text-atlas-700 rounded">{l.category}</span></div><p className="text-sm text-gray-600">{l.content}</p></div>)}</div>;
}

function CommentsSection({ projectId }: { projectId: string }) {
  const { user } = useAuth();
  const [comments, setComments] = useState<any[]>([]);
  const [newComment, setNewComment] = useState('');
  useEffect(() => { api.get(`/projects/${projectId}/comments`).then(d => setComments(d.data.data.comments)).catch(() => {}); }, [projectId]);
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    try {
      const { data } = await api.post(`/projects/${projectId}/comments`, { content: newComment });
      setComments([data.data, ...comments]);
      setNewComment('');
    } catch (err: any) { toast.error(err.response?.data?.error?.message || 'Error'); }
  };
  return (
    <div>
      {user && <form onSubmit={handleSubmit} className="mb-6"><textarea value={newComment} onChange={(e) => setNewComment(e.target.value)} placeholder="Add a comment..." className="input-field h-24 resize-none" /><button type="submit" className="btn-primary mt-2 text-sm">Post Comment</button></form>}
      <div className="space-y-4">{comments.map(c => <div key={c._id} className="card"><div className="flex items-center gap-2 mb-2"><div className="w-8 h-8 bg-atlas-100 text-atlas-700 rounded-full flex items-center justify-center text-sm">{c.user.name[0]}</div><div><p className="text-sm font-medium">{c.user.name}</p><p className="text-xs text-gray-500">{new Date(c.createdAt).toLocaleDateString()}</p></div></div><p className="text-sm text-gray-700">{c.content}</p></div>)}</div>
    </div>
  );
}
