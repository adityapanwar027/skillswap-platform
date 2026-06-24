import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { FiCheck, FiX } from 'react-icons/fi';
import SEO from '../../components/SEO';
import Button from '../../components/Button';
import EmptyState from '../../components/EmptyState';
import LoadingSpinner from '../../components/LoadingSpinner';
import { swapAPI } from '../../services/api';
import { useAuth } from '../../context/AuthContext';

const SwapRequests = () => {
  const [requests, setRequests] = useState([]);
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  const fetchRequests = async () => {
    setLoading(true);
    try {
      const params = filter === 'all' ? {} : { type: filter };
      const { data } = await swapAPI.getRequests(params);
      setRequests(data.requests);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchRequests(); }, [filter]);

  const handleRespond = async (id, status) => {
    try {
      await swapAPI.respond(id, status);
      toast.success(`Request ${status}!`);
      fetchRequests();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed');
    }
  };

  const handleComplete = async (id) => {
    try {
      await swapAPI.complete(id);
      toast.success('Swap marked as completed!');
      fetchRequests();
    } catch {
      toast.error('Failed to complete swap');
    }
  };

  if (loading) return <LoadingSpinner fullScreen />;

  return (
    <>
      <SEO title="Swap Requests" />
      <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
        <h1 className="text-2xl font-bold mb-6">Swap Requests</h1>

        <div className="mb-6 flex gap-2">
          {['all', 'received', 'sent'].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`rounded-xl px-4 py-2 text-sm font-medium capitalize ${filter === f ? 'bg-primary-600 text-white' : 'bg-gray-100 dark:bg-gray-800'}`}
            >
              {f}
            </button>
          ))}
        </div>

        {requests.length === 0 ? (
          <EmptyState title="No requests" description="You don't have any swap requests yet." />
        ) : (
          <div className="space-y-4">
            {requests.map((req) => {
              const isReceiver = req.receiver?._id === user?._id || req.receiver === user?._id;
              return (
                <div key={req._id} className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="font-semibold">{req.sender?.name} → {req.receiver?.name}</p>
                      <p className="mt-1 text-sm text-gray-500">
                        Offers <span className="font-medium text-primary-600">{req.offeredSkill?.name}</span>
                        {' '}for{' '}
                        <span className="font-medium text-violet-600">{req.requestedSkill?.name}</span>
                      </p>
                      {req.message && <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">"{req.message}"</p>}
                    </div>
                    <span className={`rounded-full px-3 py-1 text-xs font-medium capitalize ${
                      req.status === 'pending' ? 'bg-amber-100 text-amber-700' :
                      req.status === 'accepted' ? 'bg-green-100 text-green-700' :
                      req.status === 'rejected' ? 'bg-red-100 text-red-700' :
                      'bg-gray-100 text-gray-600'
                    }`}>{req.status}</span>
                  </div>
                  <div className="mt-4 flex gap-2">
                    {req.status === 'pending' && isReceiver && (
                      <>
                        <Button size="sm" onClick={() => handleRespond(req._id, 'accepted')}><FiCheck /> Accept</Button>
                        <Button size="sm" variant="danger" onClick={() => handleRespond(req._id, 'rejected')}><FiX /> Reject</Button>
                      </>
                    )}
                    {req.status === 'accepted' && (
                      <Button size="sm" variant="outline" onClick={() => handleComplete(req._id)}>Mark Complete</Button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </>
  );
};

export default SwapRequests;
