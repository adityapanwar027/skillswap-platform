import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiMail } from 'react-icons/fi';
import toast from 'react-hot-toast';
import SEO from '../../components/SEO';
import Input from '../../components/Input';
import Button from '../../components/Button';
import { authAPI } from '../../services/api';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await authAPI.forgotPassword(email);
      setSent(true);
      toast.success('Reset link sent if email exists');
    } catch {
      toast.error('Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <SEO title="Forgot Password" />
      <div className="flex min-h-[80vh] items-center justify-center px-4 py-12">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold">Forgot Password</h1>
            <p className="mt-2 text-gray-500">Enter your email to receive a reset link</p>
          </div>
          {sent ? (
            <div className="rounded-2xl border border-green-200 bg-green-50 p-8 text-center dark:border-green-800 dark:bg-green-900/20">
              <p className="text-green-700 dark:text-green-300">Check your email for a password reset link.</p>
              <Link to="/login" className="mt-4 inline-block text-primary-600 font-semibold">Back to Login</Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="rounded-2xl border border-gray-200 bg-white p-8 dark:border-gray-800 dark:bg-gray-900">
              <Input icon={FiMail} label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
              <Button type="submit" loading={loading} className="w-full mt-4">Send Reset Link</Button>
              <p className="mt-6 text-center text-sm">
                <Link to="/login" className="text-primary-600">Back to Login</Link>
              </p>
            </form>
          )}
        </motion.div>
      </div>
    </>
  );
};

export default ForgotPassword;
