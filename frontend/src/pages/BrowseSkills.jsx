import { useEffect, useState } from 'react';
import { FiSearch } from 'react-icons/fi';
import SEO from '../components/SEO';
import SkillCard from '../components/SkillCard';
import { CardSkeleton } from '../components/Skeleton';
import Input from '../components/Input';
import { skillAPI } from '../services/api';

const BrowseSkills = () => {
  const [skills, setSkills] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    skillAPI.getCategories().then(({ data }) => setCategories(data.categories)).catch(() => {});
  }, []);

  useEffect(() => {
    const fetchSkills = async () => {
      setLoading(true);
      try {
        const params = { page, limit: 12 };
        if (search) params.search = search;
        if (category) params.category = category;
        const { data } = await skillAPI.getSkills(params);
        setSkills(data.skills);
        setTotalPages(data.pages);
      } catch {
        /* ignore */
      } finally {
        setLoading(false);
      }
    };
    const debounce = setTimeout(fetchSkills, 300);
    return () => clearTimeout(debounce);
  }, [search, category, page]);

  return (
    <>
      <SEO title="Browse Skills" description="Explore skills available for exchange on SkillSwap" />
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="mb-10">
          <h1 className="text-3xl font-bold sm:text-4xl">Browse <span className="gradient-text">Skills</span></h1>
          <p className="mt-2 text-gray-500">Discover skills you can learn or teach</p>
        </div>

        <div className="mb-8 flex flex-col gap-4 sm:flex-row">
          <div className="flex-1">
            <Input
              icon={FiSearch}
              placeholder="Search skills..."
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            />
          </div>
          <select
            value={category}
            onChange={(e) => { setCategory(e.target.value); setPage(1); }}
            className="rounded-xl border border-gray-300 bg-white px-4 py-2.5 text-sm dark:border-gray-700 dark:bg-gray-900"
          >
            <option value="">All Categories</option>
            {categories.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {loading
            ? Array.from({ length: 8 }).map((_, i) => <CardSkeleton key={i} />)
            : skills.map((skill, i) => <SkillCard key={skill._id} skill={skill} index={i} />)}
        </div>

        {!loading && skills.length === 0 && (
          <p className="py-16 text-center text-gray-500">No skills found. Try adjusting your filters.</p>
        )}

        {totalPages > 1 && (
          <div className="mt-10 flex justify-center gap-2">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <button
                key={p}
                onClick={() => setPage(p)}
                className={`rounded-lg px-4 py-2 text-sm font-medium ${page === p ? 'bg-primary-600 text-white' : 'bg-gray-100 dark:bg-gray-800'}`}
              >
                {p}
              </button>
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default BrowseSkills;
