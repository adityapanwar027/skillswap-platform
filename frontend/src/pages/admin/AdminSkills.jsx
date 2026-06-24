import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import Button from '../../components/Button';
import Input from '../../components/Input';
import LoadingSpinner from '../../components/LoadingSpinner';
import { skillAPI } from '../../services/api';

const AdminSkills = () => {
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ name: '', category: 'Technology', description: '', icon: '💡' });

  const fetchSkills = () => {
    skillAPI.getSkills({ limit: 50 }).then(({ data }) => setSkills(data.skills)).finally(() => setLoading(false));
  };

  useEffect(() => { fetchSkills(); }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await skillAPI.createSkill(form);
      toast.success('Skill created!');
      setForm({ name: '', category: 'Technology', description: '', icon: '💡' });
      fetchSkills();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create skill');
    }
  };

  const handleDelete = async (id) => {
    try {
      await skillAPI.deleteSkill(id);
      toast.success('Skill deactivated');
      fetchSkills();
    } catch {
      toast.error('Failed to delete skill');
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Skill Management</h1>

      <form onSubmit={handleCreate} className="mb-8 rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900">
        <h2 className="font-bold mb-4">Add New Skill</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <Input label="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
          <div>
            <label className="mb-1.5 block text-sm font-medium">Category</label>
            <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="w-full rounded-xl border border-gray-300 px-4 py-2.5 text-sm dark:border-gray-700 dark:bg-gray-900">
              {['Technology', 'Design', 'Business', 'Languages', 'Music', 'Fitness', 'Cooking', 'Arts', 'Education', 'Other'].map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
          <Input label="Icon" value={form.icon} onChange={(e) => setForm({ ...form, icon: e.target.value })} />
          <Input label="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
        </div>
        <Button type="submit" className="mt-4">Create Skill</Button>
      </form>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {skills.map((skill) => (
          <div key={skill._id} className="rounded-2xl border border-gray-200 p-4 dark:border-gray-800">
            <div className="flex items-center gap-3">
              <span className="text-2xl">{skill.icon}</span>
              <div>
                <p className="font-semibold">{skill.name}</p>
                <p className="text-xs text-gray-500">{skill.category}</p>
              </div>
            </div>
            <Button size="sm" variant="danger" className="mt-3" onClick={() => handleDelete(skill._id)}>Deactivate</Button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminSkills;
