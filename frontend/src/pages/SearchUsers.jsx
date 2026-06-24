import { useEffect, useState } from 'react';
import { FiSearch } from 'react-icons/fi';
import SEO from '../components/SEO';
import UserCard from '../components/UserCard';
import { UserCardSkeleton } from '../components/Skeleton';
import Input from '../components/Input';
import { userAPI } from '../services/api';

const SearchUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [skill, setSkill] = useState('');

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      try {
        const params = { limit: 12 };
        if (search) params.search = search;
        if (skill) params.skill = skill;
        const { data } = await userAPI.getUsers(params);
        setUsers(data.users);
      } finally {
        setLoading(false);
      }
    };
    const debounce = setTimeout(fetchUsers, 300);
    return () => clearTimeout(debounce);
  }, [search, skill]);

  return (
    <>
      <SEO title="Search Users" />
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <h1 className="text-2xl font-bold mb-6">Find Skill Partners</h1>
        <div className="mb-8 flex flex-col gap-4 sm:flex-row">
          <div className="flex-1">
            <Input icon={FiSearch} placeholder="Search by name, bio, location..." value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
          <Input placeholder="Filter by skill..." value={skill} onChange={(e) => setSkill(e.target.value)} />
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {loading
            ? Array.from({ length: 6 }).map((_, i) => <UserCardSkeleton key={i} />)
            : users.map((u, i) => <UserCard key={u._id} user={u} index={i} />)}
        </div>
        {!loading && users.length === 0 && (
          <p className="py-16 text-center text-gray-500">No users found</p>
        )}
      </div>
    </>
  );
};

export default SearchUsers;
