import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../features/auth/AuthContext';
import { Heart, MessageSquare, ArrowLeft } from 'lucide-react';
import toast from 'react-hot-toast';

export default function CommunityPage() {
  const { user } = useAuth();
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [newPost, setNewPost] = useState('');

  const fetchPosts = useCallback(async () => {
    try {
      const { data } = await api.get('/community');
      setPosts(data.data.posts);
    } catch (err: any) { toast.error(err.response?.data?.error?.message || 'Error'); } finally { setLoading(false); }
  }, []);

  useEffect(() => { fetchPosts(); }, [fetchPosts]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPost.trim()) return;
    try {
      const { data } = await api.post('/community', { content: newPost });
      setPosts([data.data, ...posts]);
      setNewPost('');
    } catch (err: any) { toast.error(err.response?.data?.error?.message || 'Error'); }
  };

  if (loading) return <div className="max-w-5xl mx-auto px-4 py-8"><div className="animate-pulse space-y-4"><div className="h-8 bg-gray-200 rounded w-1/3" /><div className="h-4 bg-gray-200 rounded w-2/3" /></div></div>;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Link to="/discover" className="inline-flex items-center gap-1 text-sm text-gray-600 hover:text-gray-900 mb-6"><ArrowLeft className="w-4 h-4" /> Back to Discover</Link>

      <div className="mb-6">
        <h1 className="text-2xl font-bold">Community Posts</h1>
        {user && (
          <form onSubmit={handleSubmit} className="mt-4">
            <textarea
              value={newPost}
              onChange={(e) => setNewPost(e.target.value)}
              placeholder="Share something with the community..."
              className="input-field h-24 resize-none"
            />
            <button type="submit" className="btn-primary mt-2 text-sm">Post</button>
          </form>
        )}
      </div>

      <div className="space-y-6">
        {posts.length === 0 ? (
          <div className="text-center py-20"><p className="text-gray-500 text-lg">No posts yet</p></div>
        ) : (
          posts.map(post => (
            <div key={post._id} className="card border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-center gap-3 mb-4">
                {post.user.avatar ? <img src={post.user.avatar} alt="" className="w-8 h-8 rounded-full" /> : <div className="w-8 h-8 bg-atlas-100 text-atlas-700 rounded-full flex items-center justify-center font-medium text-sm">{post.user.name[0]}</div>}
                <div>
                  <p className="text-sm font-medium">{post.user.name}</p>
                  <p className="text-xs text-gray-500">{new Date(post.createdAt).toLocaleDateString()}</p>
                </div>
              </div>
              <p className="text-sm text-gray-700 mb-4">{post.content}</p>
              <div className="flex items-center gap-4 text-sm text-gray-500">
                <span className="flex items-center gap-1"><Heart className="w-4 h-4" /> {post.likes?.length || 0}</span>
                <span className="flex items-center gap-1"><MessageSquare className="w-4 h-4" /> {post.commentsCount || 0}</span>
              </div>
              <Link to={`/community/${post._id}`} className="text-atlas-600 hover:text-atlas-800 text-sm font-medium mt-2 inline-block">View post →</Link>
            </div>
          ))
        )}
      </div>
    </div>
  );
}