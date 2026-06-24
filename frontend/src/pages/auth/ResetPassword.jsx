import { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiLock } from 'react-icons/fi';
import toast from 'react-hot-toast';
import SEO from '../../components/SEO';
import Input from '../../components/Input';
import Button from '../../components/Button';
import { authAPI } from '../../services/api';

const ResetPassword = () => {
  const { token } = useParams();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) { toast.error('Passwords do not match'); return; }
    setLoading(true);
    try {
      await authAPI.resetPassword(token, password);
      toast.success('Password reset successful!');
      navigate('/login');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Reset failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <SEO title="Reset Password" />
      <div className="flex min-h-[80vh] items-center justify-center px-4 py-12">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold">Reset Password</h1>
            <p className="mt-2 text-gray-500">Enter your new password</p>
          </div>
          <form onSubmit={handleSubmit} className="rounded-2xl border border-gray-200 bg-white p-8 dark:border-gray-800 dark:bg-gray-900">
            <div className="space-y-4">
              <Input icon={FiLock} label="New Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
              <Input icon={FiLock} label="Confirm Password" type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
              <Button type="submit" loading={loading} className="w-full">Reset Password</Button>
            </div>
            <p className="mt-6 text-center text-sm">
              <Link to="/login" className="text-primary-600">Back to Login</Link>
            </p>
          </form>
        </motion.div>
      </div>
    </>
  );
};

export default ResetPassword;
