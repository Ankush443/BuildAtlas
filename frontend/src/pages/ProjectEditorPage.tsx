import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../features/auth/AuthContext';
import toast from 'react-hot-toast';
import { Save, Eye, Send, ArrowLeft, Plus, Trash2, GripVertical } from 'lucide-react';

const CATEGORIES = ['AI/ML', 'SaaS', 'Web', 'Mobile', 'Cybersecurity', 'Developer Tools', 'Data Platform', 'Game', 'API', 'Desktop', 'Other'];
const TYPES = ['Web Application', 'SaaS', 'Mobile Application', 'AI/ML', 'Developer Tool', 'Open Source', 'Desktop Application', 'Game', 'API', 'Data Platform', 'Cybersecurity', 'Other'];

export default function ProjectEditorPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [activeSection, setActiveSection] = useState('overview');
  const [saving, setSaving] = useState(false);
  const [project, setProject] = useState({
    name: '', shortDescription: '', fullDescription: '', category: 'Web', projectType: 'Web Application',
    difficulty: 'intermediate', status: 'planning', repositoryUrl: '', liveUrl: '', demoUrl: '', documentationUrl: '',
    license: '', coverImage: '', logo: '',
  });

  const sections = ['overview', 'features', 'tech-stack', 'architecture', 'database', 'api-docs', 'decisions', 'problems', 'timeline', 'deployment', 'lessons', 'settings'];

  useEffect(() => {
    if (id) {
      api.get(`/projects/${id}`).then(({ data }) => {
        const p = data.data;
        setProject({ name: p.name, shortDescription: p.shortDescription, fullDescription: p.fullDescription, category: p.category, projectType: p.projectType, difficulty: p.difficulty, status: p.status, repositoryUrl: p.repositoryUrl, liveUrl: p.liveUrl, demoUrl: p.demoUrl, documentationUrl: p.documentationUrl, license: p.license, coverImage: p.coverImage, logo: p.logo });
      }).catch(() => toast.error('Failed to load project'));
    }
  }, [id]);

  const handleSave = async (publish = false) => {
    setSaving(true);
    try {
      if (id) {
        await api.patch(`/projects/${id}`, project);
      } else {
        const { data } = await api.post('/projects', project);
        if (publish) await api.post(`/projects/${data.data._id}/publish`);
        navigate(`/projects/${data.data.slug}`);
        return;
      }
      if (publish && id) await api.post(`/projects/${id}/publish`);
      toast.success(publish ? 'Project published!' : 'Project saved!');
    } catch (err: any) { toast.error(err.response?.data?.error?.message || 'Save failed'); } finally { setSaving(false); }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate(-1)} className="p-2 hover:bg-gray-100 rounded-lg"><ArrowLeft className="w-5 h-5" /></button>
          <h1 className="text-2xl font-bold">{id ? 'Edit Project' : 'New Project'}</h1>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => handleSave(false)} disabled={saving} className="btn-secondary text-sm flex items-center gap-1.5"><Save className="w-4 h-4" /> {saving ? 'Saving...' : 'Save Draft'}</button>
          <button onClick={() => handleSave(true)} disabled={saving} className="btn-primary text-sm flex items-center gap-1.5"><Send className="w-4 h-4" /> Publish</button>
        </div>
      </div>

      <div className="flex gap-6">
        <nav className="w-56 flex-shrink-0">
          <div className="space-y-1 sticky top-24">
            {sections.map(s => (
              <button key={s} onClick={() => setActiveSection(s)} className={`w-full text-left px-3 py-2 text-sm rounded-lg capitalize ${activeSection === s ? 'bg-atlas-50 text-atlas-700 font-medium' : 'text-gray-600 hover:bg-gray-50'}`}>
                {s.replace(/-/g, ' ')}
              </button>
            ))}
          </div>
        </nav>

        <div className="flex-1 min-w-0">
          {activeSection === 'overview' && (
            <div className="card space-y-4">
              <h2 className="text-lg font-semibold">Project Overview</h2>
              <div><label className="block text-sm font-medium mb-1">Project Name *</label><input value={project.name} onChange={e => setProject({ ...project, name: e.target.value })} className="input-field" required /></div>
              <div><label className="block text-sm font-medium mb-1">Short Description *</label><textarea value={project.shortDescription} onChange={e => setProject({ ...project, shortDescription: e.target.value })} className="input-field h-20 resize-none" maxLength={300} required /><p className="text-xs text-gray-500 mt-1">{project.shortDescription.length}/300</p></div>
              <div><label className="block text-sm font-medium mb-1">Full Description</label><textarea value={project.fullDescription} onChange={e => setProject({ ...project, fullDescription: e.target.value })} className="input-field h-48 resize-none" placeholder="Describe your project in detail..." /></div>
              <div className="grid grid-cols-2 gap-4">
                <div><label className="block text-sm font-medium mb-1">Category *</label><select value={project.category} onChange={e => setProject({ ...project, category: e.target.value })} className="input-field">{CATEGORIES.map(c => <option key={c}>{c}</option>)}</select></div>
                <div><label className="block text-sm font-medium mb-1">Project Type *</label><select value={project.projectType} onChange={e => setProject({ ...project, projectType: e.target.value })} className="input-field">{TYPES.map(t => <option key={t}>{t}</option>)}</select></div>
                <div><label className="block text-sm font-medium mb-1">Difficulty</label><select value={project.difficulty} onChange={e => setProject({ ...project, difficulty: e.target.value })} className="input-field"><option value="beginner">Beginner</option><option value="intermediate">Intermediate</option><option value="advanced">Advanced</option></select></div>
                <div><label className="block text-sm font-medium mb-1">Status</label><select value={project.status} onChange={e => setProject({ ...project, status: e.target.value })} className="input-field"><option value="planning">Planning</option><option value="active-development">Active Development</option><option value="production">Production</option><option value="maintained">Maintained</option><option value="archived">Archived</option></select></div>
              </div>
              <div><label className="block text-sm font-medium mb-1">Repository URL</label><input value={project.repositoryUrl} onChange={e => setProject({ ...project, repositoryUrl: e.target.value })} className="input-field" placeholder="https://github.com/..." /></div>
              <div><label className="block text-sm font-medium mb-1">Live URL</label><input value={project.liveUrl} onChange={e => setProject({ ...project, liveUrl: e.target.value })} className="input-field" placeholder="https://..." /></div>
              <div><label className="block text-sm font-medium mb-1">License</label><input value={project.license} onChange={e => setProject({ ...project, license: e.target.value })} className="input-field" placeholder="MIT" /></div>
            </div>
          )}

          {activeSection === 'tech-stack' && <TechStackSection projectId={id} />}
          {activeSection === 'architecture' && <ArchitectureEditor projectId={id} />}
          {activeSection === 'database' && <DatabaseEditor projectId={id} />}
          {activeSection === 'api-docs' && <ApiDocsEditor projectId={id} />}
          {activeSection === 'decisions' && <DecisionsEditor projectId={id} />}
          {activeSection === 'problems' && <ProblemsEditor projectId={id} />}
          {activeSection === 'timeline' && <TimelineEditor projectId={id} />}
          {activeSection === 'deployment' && <DeploymentEditor projectId={id} />}
          {activeSection === 'lessons' && <LessonsEditor projectId={id} />}
          {activeSection === 'features' && <div className="card"><h2 className="text-lg font-semibold mb-4">Features</h2><p className="text-gray-500">Document the main features of your project in the full description above.</p></div>}
          {activeSection === 'settings' && <div className="card"><h2 className="text-lg font-semibold mb-4">Project Settings</h2><p className="text-gray-500">Additional settings coming soon.</p></div>}
        </div>
      </div>
    </div>
  );
}

function TechStackSection({ projectId }: { projectId?: string }) {
  const [techs, setTechs] = useState<any[]>([]);
  const [allTechs, setAllTechs] = useState<any[]>([]);
  const [selected, setSelected] = useState('');
  useEffect(() => {
    api.get('/technologies').then(d => setAllTechs(d.data.data)).catch(() => {});
    if (projectId) api.get(`/projects/${projectId}/technologies`).then(d => setTechs(d.data.data)).catch(() => {});
  }, [projectId]);
  const addTech = async () => {
    if (!selected || !projectId) return;
    try {
      const tech = allTechs.find(t => t._id === selected);
      await api.post(`/projects/${projectId}/technologies`, { technologyId: selected, category: tech?.category || 'frontend' });
      setTechs([...techs, { technology: tech }]);
      setSelected('');
    } catch (err: any) { toast.error(err.response?.data?.error?.message || 'Error'); }
  };
  return (
    <div className="card">
      <h2 className="text-lg font-semibold mb-4">Technology Stack</h2>
      <div className="flex gap-2 mb-4">
        <select value={selected} onChange={e => setSelected(e.target.value)} className="input-field flex-1"><option value="">Select technology...</option>{allTechs.map(t => <option key={t._id} value={t._id}>{t.name} ({t.category})</option>)}</select>
        <button onClick={addTech} className="btn-primary text-sm"><Plus className="w-4 h-4" /></button>
      </div>
      <div className="flex flex-wrap gap-2">{techs.map((t, i) => <span key={i} className="px-3 py-1 bg-atlas-50 text-atlas-700 rounded-full text-sm">{t.technology?.name}</span>)}</div>
    </div>
  );
}

function ArchitectureEditor({ projectId }: { projectId?: string }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const handleSave = async () => {
    if (!projectId || !title) return;
    try { await api.post(`/projects/${projectId}/architecture`, { title, description, nodes: [], edges: [] }); toast.success('Architecture saved'); setTitle(''); setDescription(''); } catch { toast.error('Failed'); }
  };
  return <div className="card"><h2 className="text-lg font-semibold mb-4">Architecture Diagrams</h2><div className="space-y-3 mb-4"><input value={title} onChange={e => setTitle(e.target.value)} placeholder="Diagram title" className="input-field" /><textarea value={description} onChange={e => setDescription(e.target.value)} placeholder="Description" className="input-field h-20 resize-none" /></div><div className="bg-gray-50 rounded-lg p-8 mb-4 flex items-center justify-center text-gray-400 min-h-[300px]">React Flow diagram editor will render here</div><button onClick={handleSave} className="btn-primary text-sm">Save Diagram</button></div>;
}

function DatabaseEditor({ projectId }: { projectId?: string }) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const handleSave = async () => {
    if (!projectId || !name) return;
    try { await api.post(`/projects/${projectId}/database`, { name, description, collections: [], relationships: [] }); toast.success('Schema saved'); setName(''); setDescription(''); } catch { toast.error('Failed'); }
  };
  return <div className="card"><h2 className="text-lg font-semibold mb-4">Database Documentation</h2><div className="space-y-3 mb-4"><input value={name} onChange={e => setName(e.target.value)} placeholder="Schema name (e.g., MongoDB Schema)" className="input-field" /><textarea value={description} onChange={e => setDescription(e.target.value)} placeholder="Description" className="input-field h-20 resize-none" /></div><button onClick={handleSave} className="btn-primary text-sm">Save Schema</button></div>;
}

function ApiDocsEditor({ projectId }: { projectId?: string }) {
  const [method, setMethod] = useState('GET');
  const [endpoint, setEndpoint] = useState('');
  const [description, setDescription] = useState('');
  const handleSave = async () => {
    if (!projectId || !endpoint) return;
    try { await api.post(`/projects/${projectId}/api-docs`, { method, endpoint, description, authentication: false, parameters: [], requestBody: null, responseBody: null, statusCodes: [], exampleRequest: '', exampleResponse: '' }); toast.success('Endpoint added'); setEndpoint(''); setDescription(''); } catch { toast.error('Failed'); }
  };
  return <div className="card"><h2 className="text-lg font-semibold mb-4">API Documentation</h2><div className="flex gap-2 mb-4"><select value={method} onChange={e => setMethod(e.target.value)} className="input-field w-32"><option>GET</option><option>POST</option><option>PUT</option><option>PATCH</option><option>DELETE</option></select><input value={endpoint} onChange={e => setEndpoint(e.target.value)} placeholder="/api/v1/resource" className="input-field flex-1" /><button onClick={handleSave} className="btn-primary text-sm"><Plus className="w-4 h-4" /></button></div><textarea value={description} onChange={e => setDescription(e.target.value)} placeholder="Endpoint description" className="input-field h-16 resize-none" /></div>;
}

function DecisionsEditor({ projectId }: { projectId?: string }) {
  const [title, setTitle] = useState('');
  const [problem, setProblem] = useState('');
  const [selectedSolution, setSelectedSolution] = useState('');
  const [reason, setReason] = useState('');
  const handleSave = async () => {
    if (!projectId || !title) return;
    try { await api.post(`/projects/${projectId}/decisions`, { title, problem, context: '', options: [], selectedSolution, reason, tradeoffs: '', consequences: '', status: 'accepted', date: new Date().toISOString() }); toast.success('Decision saved'); setTitle(''); setProblem(''); setSelectedSolution(''); setReason(''); } catch { toast.error('Failed'); }
  };
  return <div className="card"><h2 className="text-lg font-semibold mb-4">Engineering Decisions</h2><div className="space-y-3"><input value={title} onChange={e => setTitle(e.target.value)} placeholder="Decision title (e.g., MongoDB vs PostgreSQL)" className="input-field" /><textarea value={problem} onChange={e => setProblem(e.target.value)} placeholder="Problem statement" className="input-field h-20 resize-none" /><textarea value={selectedSolution} onChange={e => setSelectedSolution(e.target.value)} placeholder="Selected solution" className="input-field h-20 resize-none" /><textarea value={reason} onChange={e => setReason(e.target.value)} placeholder="Reason for this decision" className="input-field h-20 resize-none" /><button onClick={handleSave} className="btn-primary text-sm">Save Decision</button></div></div>;
}

function ProblemsEditor({ projectId }: { projectId?: string }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [finalSolution, setFinalSolution] = useState('');
  const handleSave = async () => {
    if (!projectId || !title) return;
    try { await api.post(`/projects/${projectId}/problems`, { title, description, symptoms: '', rootCause: '', investigation: '', failedApproaches: [], finalSolution, result: '', lessonsLearned: '' }); toast.success('Problem saved'); setTitle(''); setDescription(''); setFinalSolution(''); } catch { toast.error('Failed'); }
  };
  return <div className="card"><h2 className="text-lg font-semibold mb-4">Problems & Solutions</h2><div className="space-y-3"><input value={title} onChange={e => setTitle(e.target.value)} placeholder="Problem title" className="input-field" /><textarea value={description} onChange={e => setDescription(e.target.value)} placeholder="Problem description" className="input-field h-20 resize-none" /><textarea value={finalSolution} onChange={e => setFinalSolution(e.target.value)} placeholder="Final solution" className="input-field h-20 resize-none" /><button onClick={handleSave} className="btn-primary text-sm">Save Problem</button></div></div>;
}

function TimelineEditor({ projectId }: { projectId?: string }) {
  const [title, setTitle] = useState('');
  const [date, setDate] = useState('');
  const [description, setDescription] = useState('');
  const handleSave = async () => {
    if (!projectId || !title || !date) return;
    try { await api.post(`/projects/${projectId}/timeline`, { title, date, description, image: '', githubRef: '' }); toast.success('Event added'); setTitle(''); setDate(''); setDescription(''); } catch { toast.error('Failed'); }
  };
  return <div className="card"><h2 className="text-lg font-semibold mb-4">Development Timeline</h2><div className="space-y-3"><input value={title} onChange={e => setTitle(e.target.value)} placeholder="Event title" className="input-field" /><input type="date" value={date} onChange={e => setDate(e.target.value)} className="input-field" /><textarea value={description} onChange={e => setDescription(e.target.value)} placeholder="Description" className="input-field h-20 resize-none" /><button onClick={handleSave} className="btn-primary text-sm">Add Event</button></div></div>;
}

function DeploymentEditor({ projectId }: { projectId?: string }) {
  const [form, setForm] = useState({ cloudProvider: '', frontendHosting: '', backendHosting: '', databaseHosting: '', objectStorage: '', cdn: '', cicd: '', docker: '', domain: '', environmentConfig: '' });
  const handleSave = async () => {
    if (!projectId) return;
    try { await api.post(`/projects/${projectId}/deployment`, form); toast.success('Deployment saved'); } catch { toast.error('Failed'); }
  };
  return <div className="card"><h2 className="text-lg font-semibold mb-4">Deployment Documentation</h2><div className="space-y-3">{Object.entries(form).map(([key, value]) => <div key={key}><label className="block text-sm font-medium mb-1 capitalize">{key.replace(/([A-Z])/g, ' $1')}</label><input value={value} onChange={e => setForm({ ...form, [key]: e.target.value })} className="input-field" /></div>)}<button onClick={handleSave} className="btn-primary text-sm">Save Deployment</button></div></div>;
}

function LessonsEditor({ projectId }: { projectId?: string }) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('technical');
  const handleSave = async () => {
    if (!projectId || !title) return;
    try { await api.post(`/projects/${projectId}/lessons`, { title, content, category }); toast.success('Lesson saved'); setTitle(''); setContent(''); } catch { toast.error('Failed'); }
  };
  return <div className="card"><h2 className="text-lg font-semibold mb-4">Lessons Learned</h2><div className="space-y-3"><input value={title} onChange={e => setTitle(e.target.value)} placeholder="Lesson title" className="input-field" /><select value={category} onChange={e => setCategory(e.target.value)} className="input-field"><option value="technical">Technical</option><option value="architecture">Architecture</option><option value="performance">Performance</option><option value="security">Security</option><option value="product">Product</option><option value="mistake">Mistake</option><option value="development">Development</option></select><textarea value={content} onChange={e => setContent(e.target.value)} placeholder="What you learned..." className="input-field h-32 resize-none" /><button onClick={handleSave} className="btn-primary text-sm">Save Lesson</button></div></div>;
}
