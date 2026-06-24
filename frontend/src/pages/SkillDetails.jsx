import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import SEO from '../components/SEO';
import UserCard from '../components/UserCard';
import { UserCardSkeleton } from '../components/Skeleton';
import LoadingSpinner from '../components/LoadingSpinner';
import { skillAPI } from '../services/api';

const SkillDetails = () => {
  const { id } = useParams();
  const [skill, setSkill] = useState(null);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    skillAPI.getSkill(id)
      .then(({ data }) => { setSkill(data.skill); setUsers(data.users); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <LoadingSpinner fullScreen />;
  if (!skill) return <div className="py-20 text-center">Skill not found</div>;

  return (
    <>
      <SEO title={skill.name} description={skill.description} />
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="rounded-3xl border border-gray-200 bg-white p-8 dark:border-gray-800 dark:bg-gray-900 sm:p-12">
          <div className="flex items-start gap-6">
            <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-primary-50 text-4xl dark:bg-primary-900/30">
              {skill.icon || '💡'}
            </div>
            <div>
              <span className="rounded-full bg-primary-100 px-3 py-1 text-xs font-medium text-primary-700 dark:bg-primary-900/50">
                {skill.category}
              </span>
              <h1 className="mt-2 text-3xl font-bold sm:text-4xl">{skill.name}</h1>
              <p className="mt-4 text-gray-600 dark:text-gray-400">{skill.description}</p>
            </div>
          </div>
        </div>

        <div className="mt-12">
          <h2 className="mb-6 text-2xl font-bold">People with this skill</h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {users.length === 0 ? (
              <p className="col-span-full text-center text-gray-500 py-8">
                No users found with this skill yet. <Link to="/register" className="text-primary-600">Be the first!</Link>
              </p>
            ) : (
              users.map((user, i) => <UserCard key={user._id} user={user} index={i} />)
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default SkillDetails;
