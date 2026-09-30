import { useState, useEffect, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../features/auth/AuthContext';
import { ArrowLeft } from 'lucide-react';
import toast from 'react-hot-toast';

export default function CommunityPostDetail() {
  const { user } = useAuth();
  const { postId } = useParams();
  const [post, setPost] = useState<any>(null);
  const [comments, setComments] = useState<any[]>([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const { data } = await api.get(`/community/${postId}`);
        setPost(data.data.post);
      } catch (err: any) { toast.error(err.response?.data?.error?.message || 'Error'); } finally { setLoading(false); }
    };
    if (postId) fetchPost();
  }, [postId]);

  const fetchComments = useCallback(async () => {
    if (!postId) return;
    try {
      const { data } = await api.get(`/community/${postId}/comments`);
      setComments(data.data.comments);
    } catch {}
  }, [postId]);

  useEffect(() => { fetchComments(); }, [fetchComments]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    try {
      const { data } = await api.post(`/community/${postId}/comments`, { content: newComment });
      setComments([data.data, ...comments]);
      setNewComment('');
    } catch (err: any) { toast.error(err.response?.data?.error?.message || 'Error'); }
  };

  if (loading) return <div className="max-w-5xl mx-auto px-4 py-8"><div className="animate-pulse space-y-4"><div className="h-8 bg-gray-200 rounded w-1/3" /><div className="h-4 bg-gray-200 rounded w-2/3" /></div></div>;

  if (!post) return <div className="text-center py-20"><p className="text-gray-500">Post not found</p></div>;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Link to="/community" className="inline-flex items-center gap-1 text-sm text-gray-600 hover:text-gray-900 mb-6"><ArrowLeft className="w-4 h-4" /> Back to Community</Link>

      <div className="mb-6">
        <div className="flex items-center gap-3 mb-4">
          {post.user.avatar ? <img src={post.user.avatar} alt="" className="w-10 h-10 rounded-full" /> : <div className="w-10 h-10 bg-atlas-100 text-atlas-700 rounded-full flex items-center justify-center font-medium text-sm">{post.user.name[0]}</div>}
          <div>
            <h1 className="text-xl font-bold">{post.user.name}</h1>
            <p className="text-gray-500 text-sm">{new Date(post.createdAt).toLocaleDateString()}</p>
          </div>
        </div>
        <p className="text-sm text-gray-700">{post.content}</p>
      </div>

      <div className="border-b border-gray-200 mb-6 pb-6">
        <h2 className="text-lg font-medium mb-3">Comments ({comments.length})</h2>
        {comments.length === 0 ? (
          <p className="text-gray-500 text-sm">No comments yet. Be the first to comment!</p>
        ) : (
          <div className="space-y-3">
            {comments.map((c: any) => (
              <div key={c._id} className="card p-4 border border-gray-200 rounded">
                <div className="flex items-center gap-3 mb-2">
                  {c.user.avatar ? <img src={c.user.avatar} alt="" className="w-6 h-6 rounded-full" /> : <div className="w-6 h-6 bg-atlas-100 text-atlas-700 rounded-full flex items-center justify-center text-xs">{c.user.name[0]}</div>}
                  <div>
                    <p className="text-sm font-medium">{c.user.name}</p>
                    <p className="text-xs text-gray-500">{new Date(c.createdAt).toLocaleDateString()}</p>
                  </div>
                </div>
                <p className="text-sm text-gray-700">{c.content}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      {user && (
        <form onSubmit={handleSubmit}>
          <textarea value={newComment} onChange={(e) => setNewComment(e.target.value)} placeholder="Add a comment..." className="input-field h-24 resize-none" />
          <button type="submit" className="btn-primary mt-2 text-sm">Post Comment</button>
        </form>
      )}
    </div>
  );
}