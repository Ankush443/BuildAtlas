import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../features/auth/AuthContext';
import { ArrowLeft, MessageSquare } from 'lucide-react';
import toast from 'react-hot-toast';

export default function DirectMessagesPage() {
  const { user } = useAuth();
  const [conversations, setConversations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchConversations = async () => {
      try {
        const { data } = await api.get('/direct-messages/conversations');
        setConversations(data.data);
      } catch (err: any) { toast.error(err.response?.data?.error?.message || 'Error'); } finally { setLoading(false); }
    };
    fetchConversations();
  }, [user]);

  if (loading) return <div className="max-w-5xl mx-auto px-4 py-8"><div className="animate-pulse space-y-4"><div className="h-8 bg-gray-200 rounded w-1/3" /><div className="h-4 bg-gray-200 rounded w-2/3" /></div></div>;

  if (!conversations.length) return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Link to="/discover" className="inline-flex items-center gap-1 text-sm text-gray-600 hover:text-gray-900 mb-6"><ArrowLeft className="w-4 h-4" /> Back to Discover</Link>
      <div className="text-center py-20"><MessageSquare className="w-12 h-12 mx-auto text-gray-300 mb-4" /><p className="text-gray-500">No messages yet</p></div>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Link to="/discover" className="inline-flex items-center gap-1 text-sm text-gray-600 hover:text-gray-900 mb-6"><ArrowLeft className="w-4 h-4" /> Back to Discover</Link>

      <div className="border-b border-gray-200 mb-6 pb-4">
        <h1 className="text-2xl font-bold">Messages</h1>
      </div>

      <div className="space-y-3">
        {conversations.map((conv: any) => (
          <div key={conv._id} className="card p-4 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer">
            <div className="flex items-center gap-3 mb-2">
              {conv.recipient?.avatar ? <img src={conv.recipient.avatar} alt="" className="w-8 h-8 rounded-full" /> : <div className="w-8 h-8 bg-atlas-100 text-atlas-700 rounded-full flex items-center justify-center font-medium text-sm">{conv.recipient?.name?.[0] || '?'}</div>}
              <div>
                <p className="font-medium">{conv.recipient?.name || 'Unknown'}</p>
                <p className="text-xs text-gray-500">{conv.createdAt ? new Date(conv.createdAt).toLocaleDateString() : ''}</p>
              </div>
            </div>
            <p className="text-sm text-gray-600 line-clamp-2">{conv.content || ''}</p>
          </div>
        ))}
      </div>
    </div>
  );
}