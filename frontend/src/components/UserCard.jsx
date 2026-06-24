import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiMapPin, FiStar } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';

const UserCard = ({ user, index = 0, showActions = true }) => {
  const { user: currentUser } = useAuth();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className="rounded-2xl border border-gray-200 bg-white p-6 card-hover dark:border-gray-800 dark:bg-gray-900"
    >
      <div className="flex items-start gap-4">
        <Link to={`/users/${user._id}`}>
          <img
            src={user.avatar?.url || 'https://ui-avatars.com/api/?name=' + encodeURIComponent(user.name)}
            alt={user.name}
            className="h-16 w-16 rounded-full object-cover ring-2 ring-primary-100 dark:ring-primary-900"
          />
        </Link>
        <div className="flex-1 min-w-0">
          <Link to={`/users/${user._id}`} className="text-lg font-semibold hover:text-primary-600">
            {user.name}
          </Link>
          {user.location && (
            <p className="flex items-center gap-1 text-sm text-gray-500">
              <FiMapPin className="h-3.5 w-3.5" /> {user.location}
            </p>
          )}
          <div className="mt-1 flex items-center gap-1 text-sm text-amber-500">
            <FiStar className="h-4 w-4 fill-current" />
            <span className="font-medium">{user.averageRating?.toFixed(1) || '0.0'}</span>
            <span className="text-gray-400">({user.reviewCount || 0})</span>
          </div>
        </div>
      </div>

      {user.bio && (
        <p className="mt-4 line-clamp-2 text-sm text-gray-600 dark:text-gray-400">{user.bio}</p>
      )}

      <div className="mt-4 flex flex-wrap gap-2">
        {user.skillsOffered?.slice(0, 3).map((s, i) => (
          <span key={i} className="rounded-full bg-primary-50 px-3 py-1 text-xs font-medium text-primary-700 dark:bg-primary-900/30 dark:text-primary-300">
            {s.name}
          </span>
        ))}
      </div>

      {showActions && currentUser?._id !== user._id && (
        <div className="mt-4 flex gap-2">
          <Link
            to={`/users/${user._id}`}
            className="flex-1 rounded-xl bg-primary-600 py-2 text-center text-sm font-semibold text-white hover:bg-primary-700"
          >
            View Profile
          </Link>
        </div>
      )}
    </motion.div>
  );
};

export default UserCard;
