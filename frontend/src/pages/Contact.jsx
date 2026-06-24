import { useState } from 'react';
import { motion } from 'framer-motion';
import { FiMail, FiMapPin, FiPhone } from 'react-icons/fi';
import toast from 'react-hot-toast';
import SEO from '../components/SEO';
import Input from '../components/Input';
import Button from '../components/Button';

const Contact = () => {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1000));
    toast.success('Message sent! We\'ll get back to you soon.');
    setForm({ name: '', email: '', subject: '', message: '' });
    setLoading(false);
  };

  return (
    <>
      <SEO title="Contact" description="Get in touch with the SkillSwap team" />
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mx-auto max-w-3xl text-center">
          <h1 className="text-4xl font-bold">Get in <span className="gradient-text">Touch</span></h1>
          <p className="mt-4 text-gray-500">Have questions? We'd love to hear from you.</p>
        </motion.div>

        <div className="mt-16 grid gap-12 lg:grid-cols-2">
          <div className="space-y-8">
            {[
              { icon: FiMail, title: 'Email', info: 'hello@skillswap.com' },
              { icon: FiPhone, title: 'Phone', info: '+1 (555) 123-4567' },
              { icon: FiMapPin, title: 'Office', info: 'San Francisco, CA' },
            ].map((item) => (
              <div key={item.title} className="flex items-start gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary-50 dark:bg-primary-900/30">
                  <item.icon className="h-5 w-5 text-primary-600" />
                </div>
                <div>
                  <h3 className="font-semibold">{item.title}</h3>
                  <p className="text-gray-500">{item.info}</p>
                </div>
              </div>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="rounded-2xl border border-gray-200 bg-white p-8 dark:border-gray-800 dark:bg-gray-900">
            <div className="space-y-4">
              <Input label="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
              <Input label="Email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
              <Input label="Subject" value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} required />
              <div>
                <label className="mb-1.5 block text-sm font-medium">Message</label>
                <textarea
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  rows={5}
                  required
                  className="w-full rounded-xl border border-gray-300 bg-white px-4 py-2.5 text-sm focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20 dark:border-gray-700 dark:bg-gray-900"
                />
              </div>
              <Button type="submit" loading={loading} className="w-full">Send Message</Button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default Contact;
