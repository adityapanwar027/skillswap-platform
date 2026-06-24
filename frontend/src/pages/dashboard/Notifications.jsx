import { formatDistanceToNow } from 'date-fns';
import { FiBell } from 'react-icons/fi';
import SEO from '../../components/SEO';
import Button from '../../components/Button';
import EmptyState from '../../components/EmptyState';
import { useNotifications } from '../../context/NotificationContext';
import { useNavigate } from 'react-router-dom';

const Notifications = () => {
  const { notifications, markAsRead, markAllAsRead } = useNotifications();
  const navigate = useNavigate();

  return (
    <>
      <SEO title="Notifications" />
      <div className="mx-auto max-w-2xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">Notifications</h1>
          {notifications.some((n) => !n.isRead) && (
            <Button size="sm" variant="outline" onClick={markAllAsRead}>Mark all read</Button>
          )}
        </div>

        {notifications.length === 0 ? (
          <EmptyState icon={FiBell} title="No notifications" description="You're all caught up!" />
        ) : (
          <div className="space-y-3">
            {notifications.map((n) => (
              <button
                key={n._id}
                onClick={() => { if (!n.isRead) markAsRead(n._id); if (n.link) navigate(n.link); }}
                className={`w-full rounded-2xl border p-4 text-left transition-colors ${
                  !n.isRead ? 'border-primary-200 bg-primary-50/50 dark:border-primary-800 dark:bg-primary-900/10' :
                  'border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-semibold">{n.title}</p>
                    <p className="mt-1 text-sm text-gray-500">{n.message}</p>
                  </div>
                  <span className="text-xs text-gray-400 whitespace-nowrap ml-4">
                    {formatDistanceToNow(new Date(n.createdAt), { addSuffix: true })}
                  </span>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default Notifications;
