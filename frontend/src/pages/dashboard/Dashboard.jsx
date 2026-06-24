import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiRepeat, FiInbox, FiSend, FiStar, FiHeart, FiMessageCircle } from 'react-icons/fi';
import SEO from '../../components/SEO';
import LoadingSpinner from '../../components/LoadingSpinner';
import { userAPI, swapAPI } from '../../services/api';

const statCards = [
  { key: 'pendingReceived', label: 'Pending Requests', icon: FiInbox, color: 'text-amber-500', bg: 'bg-amber-50 dark:bg-amber-900/20' },
  { key: 'acceptedSwaps', label: 'Active Swaps', icon: FiRepeat, color: 'text-green-500', bg: 'bg-green-50 dark:bg-green-900/20' },
  { key: 'completedSwaps', label: 'Completed', icon: FiSend, color: 'text-primary-500', bg: 'bg-primary-50 dark:bg-primary-900/20' },
  { key: 'averageRating', label: 'Your Rating', icon: FiStar, color: 'text-yellow-500', bg: 'bg-yellow-50 dark:bg-yellow-900/20' },
  { key: 'favoritesCount', label: 'Favorites', icon: FiHeart, color: 'text-red-500', bg: 'bg-red-50 dark:bg-red-900/20' },
];

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [recentRequests, setRecentRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([userAPI.getDashboard(), swapAPI.getRequests({ limit: 5 })])
      .then(([dashRes, swapRes]) => {
        setStats(dashRes.data.stats);
        setRecentRequests(swapRes.data.requests);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingSpinner fullScreen />;

  return (
    <>
      <SEO title="Dashboard" />
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <h1 className="text-2xl font-bold sm:text-3xl">Dashboard</h1>
        <p className="mt-1 text-gray-500">Welcome back! Here's your activity overview.</p>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {statCards.map((card, i) => (
            <motion.div
              key={card.key}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900"
            >
              <div className={`mb-3 flex h-10 w-10 items-center justify-center rounded-xl ${card.bg}`}>
                <card.icon className={`h-5 w-5 ${card.color}`} />
              </div>
              <p className="text-2xl font-bold">{stats?.[card.key] ?? 0}</p>
              <p className="text-sm text-gray-500">{card.label}</p>
            </motion.div>
          ))}
        </div>

        <div className="mt-10 grid gap-8 lg:grid-cols-2">
          <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold">Recent Requests</h2>
              <Link to="/dashboard/requests" className="text-sm text-primary-600">View all</Link>
            </div>
            {recentRequests.length === 0 ? (
              <p className="text-gray-500 text-sm">No swap requests yet</p>
            ) : (
              <div className="space-y-3">
                {recentRequests.map((req) => (
                  <div key={req._id} className="flex items-center justify-between rounded-xl bg-gray-50 p-3 dark:bg-gray-800/50">
                    <div>
                      <p className="text-sm font-medium">{req.sender?.name} → {req.receiver?.name}</p>
                      <p className="text-xs text-gray-500">{req.offeredSkill?.name} ↔ {req.requestedSkill?.name}</p>
                    </div>
                    <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                      req.status === 'pending' ? 'bg-amber-100 text-amber-700' :
                      req.status === 'accepted' ? 'bg-green-100 text-green-700' :
                      'bg-gray-100 text-gray-600'
                    }`}>{req.status}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900">
            <h2 className="text-lg font-bold mb-4">Quick Actions</h2>
            <div className="grid gap-3 sm:grid-cols-2">
              {[
                { to: '/dashboard/profile', label: 'Edit Profile', icon: '👤' },
                { to: '/dashboard/requests', label: 'Swap Requests', icon: '🔄' },
                { to: '/chat', label: 'Messages', icon: FiMessageCircle },
                { to: '/skills', label: 'Browse Skills', icon: '💡' },
              ].map((action) => (
                <Link
                  key={action.to}
                  to={action.to}
                  className="flex items-center gap-3 rounded-xl border border-gray-200 p-4 hover:border-primary-300 hover:bg-primary-50/50 dark:border-gray-700 dark:hover:border-primary-700"
                >
                  <span className="text-xl">{typeof action.icon === 'string' ? action.icon : <action.icon className="h-5 w-5 text-primary-600" />}</span>
                  <span className="font-medium text-sm">{action.label}</span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
