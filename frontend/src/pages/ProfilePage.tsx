import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../features/auth/AuthContext';
import { User, Project } from '../types';
import { MapPin, LinkIcon, Github, Linkedin, Eye, Heart, Calendar } from 'lucide-react';
import toast from 'react-hot-toast';

export default function ProfilePage() {
  const { username } = useParams();
  const { user: currentUser } = useAuth();
  const [profile, setProfile] = useState<User | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [isFollowing, setIsFollowing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('projects');

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const { data } = await api.get(`/users/${username}`);
        setProfile(data.data);
        const { data: projData } = await api.get(`/projects?owner=${data.data._id}`);
        setProjects(projData.data?.projects || []);
        if (currentUser && currentUser._id !== data.data._id) {
          const { data: followData } = await api.get(`/users/${data.data._id}/is-following`);
          setIsFollowing(followData.data.isFollowing);
        }
      } catch { toast.error('User not found'); } finally { setLoading(false); }
    };
    fetchProfile();
  }, [username, currentUser]);

  const toggleFollow = async () => {
    if (!currentUser || !profile) { toast.error('Please log in'); return; }
    try {
      if (isFollowing) { await api.delete(`/users/${profile._id}/follow`); setIsFollowing(false); }
      else { await api.post(`/users/${profile._id}/follow`); setIsFollowing(true); }
    } catch (err: any) { toast.error(err.response?.data?.error?.message || 'Error'); }
  };

  if (loading) return <div className="max-w-4xl mx-auto px-4 py-8"><div className="animate-pulse space-y-4"><div className="h-24 bg-gray-200 rounded" /></div></div>;
  if (!profile) return <div className="text-center py-20"><p className="text-gray-500">User not found</p></div>;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="card mb-8">
        <div className="flex items-start gap-6">
          {profile.avatar ? <img src={profile.avatar} alt={profile.name} className="w-20 h-20 rounded-full" /> : <div className="w-20 h-20 bg-atlas-100 text-atlas-700 rounded-full flex items-center justify-center text-2xl font-bold">{profile.name[0]}</div>}
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold">{profile.name}</h1>
                <p className="text-gray-500">@{profile.username}</p>
              </div>
              {currentUser && currentUser._id !== profile._id && (
                <button onClick={toggleFollow} className={isFollowing ? 'btn-secondary text-sm' : 'btn-primary text-sm'}>
                  {isFollowing ? 'Following' : 'Follow'}
                </button>
              )}
            </div>
            {profile.bio && <p className="text-gray-600 mt-2">{profile.bio}</p>}
            <div className="flex flex-wrap items-center gap-4 mt-3 text-sm text-gray-500">
              {profile.location && <span className="flex items-center gap-1"><MapPin className="w-4 h-4" /> {profile.location}</span>}
              {profile.website && <a href={profile.website} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 hover:text-atlas-600"><LinkIcon className="w-4 h-4" /> Website</a>}
              {profile.github && <a href={profile.github} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 hover:text-atlas-600"><Github className="w-4 h-4" /> GitHub</a>}
              {profile.linkedin && <a href={profile.linkedin} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 hover:text-atlas-600"><Linkedin className="w-4 h-4" /> LinkedIn</a>}
            </div>
            {profile.skills.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-3">{profile.skills.map(skill => <span key={skill} className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs">{skill}</span>)}</div>
            )}
          </div>
        </div>
      </div>

      <div className="border-b border-gray-200 mb-6">
        <div className="flex gap-1">
          <button onClick={() => setActiveTab('projects')} className={`px-4 py-2 text-sm font-medium border-b-2 ${activeTab === 'projects' ? 'border-atlas-600 text-atlas-600' : 'border-transparent text-gray-500'}`}>Projects ({projects.length})</button>
          <button onClick={() => setActiveTab('followers')} className={`px-4 py-2 text-sm font-medium border-b-2 ${activeTab === 'followers' ? 'border-atlas-600 text-atlas-600' : 'border-transparent text-gray-500'}`}>Followers ({profile.followers.length})</button>
          <button onClick={() => setActiveTab('following')} className={`px-4 py-2 text-sm font-medium border-b-2 ${activeTab === 'following' ? 'border-atlas-600 text-atlas-600' : 'border-transparent text-gray-500'}`}>Following ({profile.following.length})</button>
        </div>
      </div>

      {activeTab === 'projects' && (
        <div className="grid md:grid-cols-2 gap-4">
          {projects.map(project => (
            <Link key={project._id} to={`/projects/${project.slug}`} className="card hover:shadow-lg transition-shadow">
              <h3 className="font-semibold mb-1">{project.name}</h3>
              <p className="text-sm text-gray-600 line-clamp-2 mb-3">{project.shortDescription}</p>
              <div className="flex items-center gap-4 text-xs text-gray-500">
                <span className="flex items-center gap-1"><Eye className="w-3 h-3" /> {project.views}</span>
                <span className="flex items-center gap-1"><Heart className="w-3 h-3" /> {project.likesCount}</span>
              </div>
            </Link>
          ))}
          {projects.length === 0 && <p className="text-gray-500 col-span-2">No projects yet.</p>}
        </div>
      )}
      {activeTab === 'followers' && <p className="text-gray-500">Followers list coming soon.</p>}
      {activeTab === 'following' && <p className="text-gray-500">Following list coming soon.</p>}
    </div>
  );
}
