import { NavLink, Outlet } from 'react-router-dom';
import { FiLayout, FiUser, FiRepeat, FiBell, FiSettings } from 'react-icons/fi';

const links = [
  { to: '/dashboard', icon: FiLayout, label: 'Overview', end: true },
  { to: '/dashboard/profile', icon: FiUser, label: 'Profile' },
  { to: '/dashboard/requests', icon: FiRepeat, label: 'Requests' },
  { to: '/dashboard/notifications', icon: FiBell, label: 'Notifications' },
  { to: '/dashboard/settings', icon: FiSettings, label: 'Settings' },
];

const DashboardLayout = () => (
  <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
    <div className="flex gap-8 py-8">
      <aside className="hidden w-56 shrink-0 lg:block">
        <nav className="sticky top-24 space-y-1">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.end}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-medium transition-colors ${
                  isActive ? 'bg-primary-50 text-primary-700 dark:bg-primary-900/30 dark:text-primary-300' :
                  'text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800'
                }`
              }
            >
              <link.icon className="h-4 w-4" /> {link.label}
            </NavLink>
          ))}
        </nav>
      </aside>
      <div className="flex-1 min-w-0">
        <Outlet />
      </div>
    </div>
  </div>
);

export default DashboardLayout;
