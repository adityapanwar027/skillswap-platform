import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { FiPlus, FiTrash2, FiCamera } from 'react-icons/fi';
import SEO from '../../components/SEO';
import Input from '../../components/Input';
import Button from '../../components/Button';
import LoadingSpinner from '../../components/LoadingSpinner';
import { useAuth } from '../../context/AuthContext';
import { userAPI } from '../../services/api';

const Profile = () => {
  const { user, updateUser } = useAuth();
  const [form, setForm] = useState({ name: '', bio: '', location: '', skillsOffered: [], skillsWanted: [] });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (user) {
      setForm({
        name: user.name || '',
        bio: user.bio || '',
        location: user.location || '',
        skillsOffered: user.skillsOffered || [],
        skillsWanted: user.skillsWanted || [],
      });
      setLoading(false);
    }
  }, [user]);

  const handleAvatarUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const formData = new FormData();
    formData.append('avatar', file);
    try {
      const { data } = await userAPI.uploadAvatar(formData);
      updateUser({ avatar: data.avatar });
      toast.success('Avatar updated!');
    } catch {
      toast.error('Upload failed. Check Cloudinary config.');
    }
  };

  const addSkill = (type) => {
    setForm((prev) => ({
      ...prev,
      [type]: [...prev[type], { name: '', level: 'intermediate', description: '' }],
    }));
  };

  const updateSkill = (type, index, field, value) => {
    setForm((prev) => {
      const skills = [...prev[type]];
      skills[index] = { ...skills[index], [field]: value };
      return { ...prev, [type]: skills };
    });
  };

  const removeSkill = (type, index) => {
    setForm((prev) => ({ ...prev, [type]: prev[type].filter((_, i) => i !== index) }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const { data } = await userAPI.updateProfile(form);
      updateUser(data.user);
      toast.success('Profile updated!');
    } catch {
      toast.error('Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <LoadingSpinner fullScreen />;

  const SkillEditor = ({ type, title }) => (
    <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-bold">{title}</h3>
        <Button size="sm" variant="outline" onClick={() => addSkill(type)}><FiPlus /> Add</Button>
      </div>
      <div className="space-y-4">
        {form[type].map((skill, i) => (
          <div key={i} className="rounded-xl border border-gray-200 p-4 dark:border-gray-700">
            <div className="grid gap-3 sm:grid-cols-2">
              <Input label="Skill Name" value={skill.name} onChange={(e) => updateSkill(type, i, 'name', e.target.value)} />
              <div>
                <label className="mb-1.5 block text-sm font-medium">Level</label>
                <select
                  value={skill.level}
                  onChange={(e) => updateSkill(type, i, 'level', e.target.value)}
                  className="w-full rounded-xl border border-gray-300 px-4 py-2.5 text-sm dark:border-gray-700 dark:bg-gray-900"
                >
                  {['beginner', 'intermediate', 'advanced', 'expert'].map((l) => (
                    <option key={l} value={l}>{l.charAt(0).toUpperCase() + l.slice(1)}</option>
                  ))}
                </select>
              </div>
            </div>
            <Input label="Description" className="mt-3" value={skill.description} onChange={(e) => updateSkill(type, i, 'description', e.target.value)} />
            <button onClick={() => removeSkill(type, i)} className="mt-2 flex items-center gap-1 text-sm text-red-500">
              <FiTrash2 className="h-4 w-4" /> Remove
            </button>
          </div>
        ))}
        {form[type].length === 0 && <p className="text-sm text-gray-500">No skills added yet</p>}
      </div>
    </div>
  );

  return (
    <>
      <SEO title="Edit Profile" />
      <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
        <h1 className="text-2xl font-bold mb-8">Edit Profile</h1>

        <div className="mb-8 flex items-center gap-6">
          <div className="relative">
            <img
              src={user?.avatar?.url || `https://ui-avatars.com/api/?name=${user?.name}`}
              alt={user?.name}
              className="h-24 w-24 rounded-full object-cover ring-4 ring-primary-100 dark:ring-primary-900"
            />
            <label className="absolute bottom-0 right-0 flex h-8 w-8 cursor-pointer items-center justify-center rounded-full bg-primary-600 text-white hover:bg-primary-700">
              <FiCamera className="h-4 w-4" />
              <input type="file" accept="image/*" className="hidden" onChange={handleAvatarUpload} />
            </label>
          </div>
          <div>
            <h2 className="text-xl font-bold">{user?.name}</h2>
            <p className="text-gray-500">{user?.email}</p>
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900 space-y-4">
            <Input label="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            <Input label="Location" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} />
            <div>
              <label className="mb-1.5 block text-sm font-medium">Bio</label>
              <textarea
                value={form.bio}
                onChange={(e) => setForm({ ...form, bio: e.target.value })}
                rows={4}
                maxLength={500}
                className="w-full rounded-xl border border-gray-300 px-4 py-2.5 text-sm dark:border-gray-700 dark:bg-gray-900"
              />
            </div>
          </div>

          <SkillEditor type="skillsOffered" title="Skills I Offer" />
          <SkillEditor type="skillsWanted" title="Skills I Want to Learn" />

          <Button onClick={handleSave} loading={saving} size="lg" className="w-full">Save Profile</Button>
        </div>
      </div>
    </>
  );
};

export default Profile;
