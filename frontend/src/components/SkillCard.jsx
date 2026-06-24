import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FiStar } from 'react-icons/fi';

const SkillCard = ({ skill, index = 0 }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: index * 0.05 }}
  >
    <Link
      to={`/skills/${skill._id}`}
      className="group block rounded-2xl border border-gray-200 bg-white p-6 card-hover dark:border-gray-800 dark:bg-gray-900"
    >
      <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary-50 text-2xl dark:bg-primary-900/30">
        {skill.icon || '💡'}
      </div>
      <h3 className="mb-2 text-lg font-semibold group-hover:text-primary-600">{skill.name}</h3>
      <p className="mb-4 line-clamp-2 text-sm text-gray-500 dark:text-gray-400">{skill.description}</p>
      <div className="flex items-center justify-between">
        <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-600 dark:bg-gray-800 dark:text-gray-300">
          {skill.category}
        </span>
        {skill.isFeatured && (
          <span className="flex items-center gap-1 text-xs font-medium text-amber-500">
            <FiStar className="h-3 w-3" /> Featured
          </span>
        )}
      </div>
    </Link>
  </motion.div>
);

export default SkillCard;
