import { useEffect, useState } from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { FiBarChart2, FiUsers, FiBook, FiMessageSquare, FiActivity } from 'react-icons/fi';
import SEO from '../../components/SEO';
import LoadingSpinner from '../../components/LoadingSpinner';
import { adminAPI } from '../../services/api';

const adminLinks = [
  { to: '/admin', icon: FiBarChart2, label: 'Analytics', end: true },
  { to: '/admin/users', icon: FiUsers, label: 'Users' },
  { to: '/admin/skills', icon: FiBook, label: 'Skills' },
  { to: '/admin/reviews', icon: FiMessageSquare, label: 'Reviews' },
  { to: '/admin/activity', icon: FiActivity, label: 'Activity Logs' },
];

export const AdminAnalytics = () => {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminAPI.getAnalytics().then(({ data }) => setAnalytics(data.analytics)).finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingSpinner />;

  const stats = [
    { label: 'Total Users', value: analytics?.totalUsers },
    { label: 'Active Users', value: analytics?.activeUsers },
    { label: 'Skills', value: analytics?.totalSkills },
    { label: 'Swaps', value: analytics?.totalSwaps },
    { label: 'Reviews', value: analytics?.totalReviews },
    { label: 'Messages', value: analytics?.totalMessages },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Analytics Dashboard</h1>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {stats.map((s) => (
          <div key={s.label} className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900">
            <p className="text-3xl font-bold">{s.value ?? 0}</p>
            <p className="text-sm text-gray-500">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="mt-8 rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900">
        <h2 className="font-bold mb-4">Recent Activity</h2>
        <div className="space-y-3">
          {analytics?.recentActivity?.map((log) => (
            <div key={log._id} className="flex items-center justify-between rounded-xl bg-gray-50 p-3 text-sm dark:bg-gray-800/50">
              <span>{log.user?.name || 'System'} — {log.action}</span>
              <span className="text-xs text-gray-400">{new Date(log.createdAt).toLocaleString()}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminAPI.getUsers().then(({ data }) => setUsers(data.users)).finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingSpinner />;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">User Management</h1>
      <div className="overflow-x-auto rounded-2xl border border-gray-200 dark:border-gray-800">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 dark:bg-gray-800/50">
            <tr>
              <th className="px-4 py-3 text-left">Name</th>
              <th className="px-4 py-3 text-left">Email</th>
              <th className="px-4 py-3 text-left">Role</th>
              <th className="px-4 py-3 text-left">Status</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u._id} className="border-t border-gray-200 dark:border-gray-800">
                <td className="px-4 py-3">{u.name}</td>
                <td className="px-4 py-3">{u.email}</td>
                <td className="px-4 py-3 capitalize">{u.role}</td>
                <td className="px-4 py-3">
                  <span className={`rounded-full px-2 py-0.5 text-xs ${u.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                    {u.isActive ? 'Active' : 'Inactive'}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export const AdminReviews = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminAPI.getReviews().then(({ data }) => setReviews(data.reviews)).finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingSpinner />;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Review Moderation</h1>
      <div className="space-y-4">
        {reviews.map((r) => (
          <div key={r._id} className="rounded-2xl border border-gray-200 p-4 dark:border-gray-800">
            <div className="flex justify-between">
              <p className="font-medium">{r.reviewer?.name} → {r.reviewee?.name}</p>
              <span className="text-amber-500">{'★'.repeat(r.rating)}</span>
            </div>
            <p className="mt-2 text-sm text-gray-500">{r.comment}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export const AdminActivity = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminAPI.getActivity().then(({ data }) => setLogs(data.logs)).finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingSpinner />;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Activity Logs</h1>
      <div className="space-y-2">
        {logs.map((log) => (
          <div key={log._id} className="rounded-xl border border-gray-200 p-3 text-sm dark:border-gray-800">
            <span className="font-medium">{log.action}</span> — {log.user?.name || 'Anonymous'}
            <span className="ml-2 text-xs text-gray-400">{new Date(log.createdAt).toLocaleString()}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

const AdminLayout = () => (
  <>
    <SEO title="Admin Panel" />
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="flex gap-8">
        <aside className="hidden w-56 shrink-0 lg:block">
          <h2 className="mb-4 text-lg font-bold gradient-text">Admin Panel</h2>
          <nav className="space-y-1">
            {adminLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.end}
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-medium ${
                    isActive ? 'bg-primary-50 text-primary-700 dark:bg-primary-900/30' : 'text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800'
                  }`
                }
              >
                <link.icon className="h-4 w-4" /> {link.label}
              </NavLink>
            ))}
          </nav>
        </aside>
        <div className="flex-1">
          <Outlet />
        </div>
      </div>
    </div>
  </>
);

export default AdminLayout;
