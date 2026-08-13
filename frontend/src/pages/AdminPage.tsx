import { useState, useEffect } from 'react';
import api from '../services/api';
import { Users, FolderOpen, MessageSquare, Heart, Eye, Shield, Search } from 'lucide-react';
import toast from 'react-hot-toast';

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState('overview');
  const [analytics, setAnalytics] = useState<any>(null);
  const [users, setUsers] = useState<any[]>([]);
  const [projects, setProjects] = useState<any[]>([]);
  const [reports, setReports] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [analyticsRes, usersRes, projectsRes, reportsRes] = await Promise.all([
          api.get('/admin/analytics'),
          api.get('/admin/users'),
          api.get('/admin/projects'),
          api.get('/admin/reports'),
        ]);
        setAnalytics(analyticsRes.data.data);
        setUsers(usersRes.data.data.users);
        setProjects(projectsRes.data.data.projects);
        setReports(reportsRes.data.data.reports);
      } catch {} finally { setLoading(false); }
    };
    fetchAll();
  }, []);

  const suspendUser = async (userId: string) => {
    try { await api.post(`/admin/users/${userId}/suspend`); toast.success('User suspended'); setUsers(users.map(u => u._id === userId ? { ...u, role: 'suspended' } : u)); } catch { toast.error('Failed'); }
  };

  const hideProject = async (projectId: string) => {
    try { await api.post(`/admin/projects/${projectId}/hide`); toast.success('Project hidden'); setProjects(projects.map(p => p._id === projectId ? { ...p, visibility: 'private' } : p)); } catch { toast.error('Failed'); }
  };

  const resolveReport = async (reportId: string) => {
    try { await api.post(`/admin/reports/${reportId}/resolve`, { adminNote: 'Resolved' }); toast.success('Report resolved'); setReports(reports.map(r => r._id === reportId ? { ...r, status: 'resolved' } : r)); } catch { toast.error('Failed'); }
  };

  if (loading) return <div className="max-w-7xl mx-auto px-4 py-8"><div className="animate-pulse space-y-4"><div className="h-32 bg-gray-200 rounded" /></div></div>;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center gap-3 mb-6">
        <Shield className="w-6 h-6 text-atlas-600" />
        <h1 className="text-2xl font-bold">Admin Dashboard</h1>
      </div>

      {analytics && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
          <div className="card text-center"><Users className="w-6 h-6 mx-auto mb-2 text-atlas-600" /><p className="text-2xl font-bold">{analytics.totalUsers}</p><p className="text-xs text-gray-500">Total Users</p></div>
          <div className="card text-center"><FolderOpen className="w-6 h-6 mx-auto mb-2 text-atlas-600" /><p className="text-2xl font-bold">{analytics.totalProjects}</p><p className="text-xs text-gray-500">Total Projects</p></div>
          <div className="card text-center"><Eye className="w-6 h-6 mx-auto mb-2 text-atlas-600" /><p className="text-2xl font-bold">{analytics.publishedProjects}</p><p className="text-xs text-gray-500">Published</p></div>
          <div className="card text-center"><MessageSquare className="w-6 h-6 mx-auto mb-2 text-atlas-600" /><p className="text-2xl font-bold">{analytics.totalComments}</p><p className="text-xs text-gray-500">Comments</p></div>
          <div className="card text-center"><Heart className="w-6 h-6 mx-auto mb-2 text-atlas-600" /><p className="text-2xl font-bold">{analytics.totalLikes}</p><p className="text-xs text-gray-500">Likes</p></div>
          <div className="card text-center"><Users className="w-6 h-6 mx-auto mb-2 text-green-600" /><p className="text-2xl font-bold">{analytics.activeUsers}</p><p className="text-xs text-gray-500">Active (30d)</p></div>
        </div>
      )}

      <div className="border-b border-gray-200 mb-6">
        <div className="flex gap-1">
          {['overview', 'users', 'projects', 'reports'].map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)} className={`px-4 py-2 text-sm font-medium capitalize border-b-2 ${activeTab === tab ? 'border-atlas-600 text-atlas-600' : 'border-transparent text-gray-500'}`}>{tab}</button>
          ))}
        </div>
      </div>

      {activeTab === 'users' && (
        <div>
          <div className="relative mb-4"><Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" /><input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search users..." className="input-field pl-10" /></div>
          <div className="space-y-2">{users.filter(u => !search || u.name.includes(search) || u.username.includes(search)).map(user => (
            <div key={user._id} className="card flex items-center justify-between py-3">
              <div className="flex items-center gap-3">
                {user.avatar ? <img src={user.avatar} alt="" className="w-10 h-10 rounded-full" /> : <div className="w-10 h-10 bg-atlas-100 text-atlas-700 rounded-full flex items-center justify-center font-medium">{user.name[0]}</div>}
                <div><p className="font-medium text-sm">{user.name}</p><p className="text-xs text-gray-500">@{user.username} &middot; {user.email}</p></div>
              </div>
              <div className="flex items-center gap-2">
                <span className={`text-xs px-2 py-1 rounded ${user.role === 'admin' ? 'bg-atlas-50 text-atlas-700' : user.role === 'suspended' ? 'bg-red-50 text-red-700' : 'bg-gray-100 text-gray-600'}`}>{user.role}</span>
                {user.role !== 'admin' && user.role !== 'suspended' && <button onClick={() => suspendUser(user._id)} className="text-xs text-red-600 hover:text-red-700">Suspend</button>}
              </div>
            </div>
          ))}</div>
        </div>
      )}

      {activeTab === 'projects' && (
        <div>
          <div className="relative mb-4"><Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" /><input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search projects..." className="input-field pl-10" /></div>
          <div className="space-y-2">{projects.filter(p => !search || p.name.includes(search)).map(project => (
            <div key={project._id} className="card flex items-center justify-between py-3">
              <div><p className="font-medium text-sm">{project.name}</p><p className="text-xs text-gray-500">by {project.owner?.name} &middot; {project.views} views</p></div>
              <div className="flex items-center gap-2">
                <span className={`text-xs px-2 py-1 rounded ${project.visibility === 'public' ? 'bg-green-50 text-green-700' : 'bg-gray-100 text-gray-600'}`}>{project.visibility}</span>
                {project.visibility === 'public' && <button onClick={() => hideProject(project._id)} className="text-xs text-red-600 hover:text-red-700">Hide</button>}
              </div>
            </div>
          ))}</div>
        </div>
      )}

      {activeTab === 'reports' && (
        <div className="space-y-2">{reports.length === 0 ? <p className="text-gray-500">No reports.</p> : reports.map(report => (
          <div key={report._id} className="card py-3">
            <div className="flex items-center justify-between">
              <div><p className="text-sm font-medium">Report: {report.targetType}</p><p className="text-xs text-gray-500">Reason: {report.reason} &middot; by {report.reporter?.name}</p></div>
              <div className="flex items-center gap-2">
                <span className={`text-xs px-2 py-1 rounded ${report.status === 'resolved' ? 'bg-green-50 text-green-700' : report.status === 'rejected' ? 'bg-red-50 text-red-700' : 'bg-yellow-50 text-yellow-700'}`}>{report.status}</span>
                {report.status === 'pending' && <button onClick={() => resolveReport(report._id)} className="text-xs text-green-600 hover:text-green-700">Resolve</button>}
              </div>
            </div>
          </div>
        ))}</div>
      )}

      {activeTab === 'overview' && (
        <div className="card">
          <h2 className="text-lg font-semibold mb-4">Platform Overview</h2>
          <p className="text-gray-600">Welcome to the admin dashboard. Use the tabs above to manage users, projects, and reports.</p>
        </div>
      )}
    </div>
  );
}
