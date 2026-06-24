import { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FiMenu, FiX, FiSun, FiMoon, FiBell, FiUser, FiLogOut,
  FiLayout, FiMessageCircle, FiSettings, FiShield,
} from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useNotifications } from '../context/NotificationContext';
import Button from './Button';

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const { notifications, unreadCount, markAsRead } = useNotifications();
  const navigate = useNavigate();

  const navLinks = [
    { to: '/', label: 'Home' },
    { to: '/skills', label: 'Browse Skills' },
    { to: '/about', label: 'About' },
    { to: '/contact', label: 'Contact' },
  ];

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const navClass = ({ isActive }) =>
    `text-sm font-medium transition-colors ${isActive ? 'text-primary-600' : 'text-gray-600 hover:text-primary-600 dark:text-gray-300 dark:hover:text-primary-400'}`;

  return (
    <nav className="sticky top-0 z-40 glass border-b border-gray-200/50 dark:border-gray-800/50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-primary-500 to-violet-600 text-white font-bold text-lg">
              S
            </div>
            <span className="text-xl font-bold gradient-text">SkillSwap</span>
          </Link>

          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <NavLink key={link.to} to={link.to} className={navClass}>{link.label}</NavLink>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={toggleTheme}
              className="rounded-xl p-2.5 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800"
              aria-label="Toggle theme"
            >
              {isDark ? <FiSun className="h-5 w-5" /> : <FiMoon className="h-5 w-5" />}
            </button>

            {isAuthenticated ? (
              <>
                <div className="relative">
                  <button
                    onClick={() => setNotifOpen(!notifOpen)}
                    className="relative rounded-xl p-2.5 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800"
                  >
                    <FiBell className="h-5 w-5" />
                    {unreadCount > 0 && (
                      <span className="absolute -right-0.5 -top-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
                        {unreadCount > 9 ? '9+' : unreadCount}
                      </span>
                    )}
                  </button>
                  <AnimatePresence>
                    {notifOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        className="absolute right-0 mt-2 w-80 rounded-2xl border border-gray-200 bg-white shadow-xl dark:border-gray-800 dark:bg-gray-900"
                      >
                        <div className="border-b border-gray-200 p-4 dark:border-gray-800">
                          <h3 className="font-semibold">Notifications</h3>
                        </div>
                        <div className="max-h-80 overflow-y-auto">
                          {notifications.length === 0 ? (
                            <p className="p-4 text-center text-sm text-gray-500">No notifications</p>
                          ) : (
                            notifications.slice(0, 8).map((n) => (
                              <button
                                key={n._id}
                                onClick={() => { markAsRead(n._id); if (n.link) navigate(n.link); setNotifOpen(false); }}
                                className={`w-full border-b border-gray-100 p-4 text-left hover:bg-gray-50 dark:border-gray-800 dark:hover:bg-gray-800/50 ${!n.isRead ? 'bg-primary-50/50 dark:bg-primary-900/10' : ''}`}
                              >
                                <p className="text-sm font-medium">{n.title}</p>
                                <p className="text-xs text-gray-500 line-clamp-2">{n.message}</p>
                              </button>
                            ))
                          )}
                        </div>
                        <Link to="/dashboard/notifications" onClick={() => setNotifOpen(false)} className="block p-3 text-center text-sm font-medium text-primary-600 hover:bg-gray-50 dark:hover:bg-gray-800">
                          View all
                        </Link>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                <div className="relative hidden md:block">
                  <button
                    onClick={() => setProfileOpen(!profileOpen)}
                    className="flex items-center gap-2 rounded-xl p-1.5 hover:bg-gray-100 dark:hover:bg-gray-800"
                  >
                    <img
                      src={user?.avatar?.url || `https://ui-avatars.com/api/?name=${user?.name}`}
                      alt={user?.name}
                      className="h-8 w-8 rounded-full"
                    />
                  </button>
                  <AnimatePresence>
                    {profileOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        className="absolute right-0 mt-2 w-56 rounded-2xl border border-gray-200 bg-white py-2 shadow-xl dark:border-gray-800 dark:bg-gray-900"
                      >
                        <div className="border-b border-gray-200 px-4 py-3 dark:border-gray-800">
                          <p className="font-semibold">{user?.name}</p>
                          <p className="text-xs text-gray-500">{user?.email}</p>
                        </div>
                        {[
                          { to: '/dashboard', icon: FiLayout, label: 'Dashboard' },
                          { to: '/chat', icon: FiMessageCircle, label: 'Messages' },
                          { to: '/dashboard/settings', icon: FiSettings, label: 'Settings' },
                          ...(isAdmin ? [{ to: '/admin', icon: FiShield, label: 'Admin Panel' }] : []),
                        ].map((item) => (
                          <Link
                            key={item.to}
                            to={item.to}
                            onClick={() => setProfileOpen(false)}
                            className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-800"
                          >
                            <item.icon className="h-4 w-4" /> {item.label}
                          </Link>
                        ))}
                        <button
                          onClick={handleLogout}
                          className="flex w-full items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                        >
                          <FiLogOut className="h-4 w-4" /> Logout
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </>
            ) : (
              <div className="hidden md:flex items-center gap-3">
                <Link to="/login"><Button variant="ghost">Login</Button></Link>
                <Link to="/register"><Button>Get Started</Button></Link>
              </div>
            )}

            <button
              className="md:hidden rounded-xl p-2.5 text-gray-500"
              onClick={() => setMobileOpen(!mobileOpen)}
            >
              {mobileOpen ? <FiX className="h-6 w-6" /> : <FiMenu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="md:hidden border-t border-gray-200 dark:border-gray-800"
          >
            <div className="space-y-1 px-4 py-4">
              {navLinks.map((link) => (
                <NavLink key={link.to} to={link.to} onClick={() => setMobileOpen(false)} className={navClass}>
                  {link.label}
                </NavLink>
              ))}
              {!isAuthenticated && (
                <div className="flex flex-col gap-2 pt-4">
                  <Link to="/login" onClick={() => setMobileOpen(false)}><Button variant="outline" className="w-full">Login</Button></Link>
                  <Link to="/register" onClick={() => setMobileOpen(false)}><Button className="w-full">Get Started</Button></Link>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
