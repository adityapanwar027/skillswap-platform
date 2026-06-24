import { useState } from 'react';
import toast from 'react-hot-toast';
import { FiLock, FiTrash2 } from 'react-icons/fi';
import SEO from '../../components/SEO';
import Input from '../../components/Input';
import Button from '../../components/Button';
import Modal from '../../components/Modal';
import { useAuth } from '../../context/AuthContext';
import { authAPI, userAPI } from '../../services/api';
import { useNavigate } from 'react-router-dom';

const Settings = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [passwordForm, setPasswordForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [loading, setLoading] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    setLoading(true);
    try {
      await authAPI.updatePassword({
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword,
      });
      toast.success('Password updated!');
      setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update password');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    try {
      await userAPI.deleteProfile();
      await logout();
      navigate('/');
      toast.success('Account deleted');
    } catch {
      toast.error('Failed to delete account');
    }
  };

  return (
    <>
      <SEO title="Account Settings" />
      <div className="mx-auto max-w-2xl px-4 py-8 sm:px-6 lg:px-8">
        <h1 className="text-2xl font-bold mb-8">Account Settings</h1>

        <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900 mb-6">
          <h2 className="font-bold mb-4">Account Info</h2>
          <p className="text-sm text-gray-500">Email: {user?.email}</p>
          <p className="text-sm text-gray-500">Role: {user?.role}</p>
        </div>

        <form onSubmit={handlePasswordChange} className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900 mb-6">
          <h2 className="font-bold mb-4 flex items-center gap-2"><FiLock /> Change Password</h2>
          <div className="space-y-4">
            <Input label="Current Password" type="password" value={passwordForm.currentPassword} onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })} required />
            <Input label="New Password" type="password" value={passwordForm.newPassword} onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })} required />
            <Input label="Confirm New Password" type="password" value={passwordForm.confirmPassword} onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })} required />
            <Button type="submit" loading={loading}>Update Password</Button>
          </div>
        </form>

        <div className="rounded-2xl border border-red-200 bg-red-50 p-6 dark:border-red-900 dark:bg-red-900/20">
          <h2 className="font-bold text-red-700 dark:text-red-400 mb-2">Danger Zone</h2>
          <p className="text-sm text-red-600 dark:text-red-300 mb-4">Permanently delete your account and all data.</p>
          <Button variant="danger" onClick={() => setDeleteOpen(true)}><FiTrash2 /> Delete Account</Button>
        </div>
      </div>

      <Modal isOpen={deleteOpen} onClose={() => setDeleteOpen(false)} title="Delete Account">
        <p className="text-gray-600 dark:text-gray-400 mb-6">Are you sure? This action cannot be undone.</p>
        <div className="flex gap-3">
          <Button variant="secondary" onClick={() => setDeleteOpen(false)} className="flex-1">Cancel</Button>
          <Button variant="danger" onClick={handleDeleteAccount} className="flex-1">Delete</Button>
        </div>
      </Modal>
    </>
  );
};

export default Settings;
