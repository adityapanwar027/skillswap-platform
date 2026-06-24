import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiArrowRight, FiUsers, FiRepeat, FiStar, FiChevronDown } from 'react-icons/fi';
import SEO from '../components/SEO';
import Button from '../components/Button';
import SkillCard from '../components/SkillCard';
import { CardSkeleton } from '../components/Skeleton';
import { skillAPI, userAPI } from '../services/api';

const testimonials = [
  { name: 'Sarah Chen', role: 'UX Designer', text: 'I traded my design skills for Python tutoring. Best decision ever!', avatar: 'SC' },
  { name: 'Marcus Johnson', role: 'Developer', text: 'SkillSwap helped me learn guitar while teaching React. Amazing community!', avatar: 'MJ' },
  { name: 'Elena Rodriguez', role: 'Language Teacher', text: 'The platform makes skill exchange seamless and fun. Highly recommend!', avatar: 'ER' },
];

const faqs = [
  { q: 'How does SkillSwap work?', a: 'Create a profile, list skills you offer and want to learn, then connect with matching users to swap knowledge.' },
  { q: 'Is SkillSwap free to use?', a: 'Yes! SkillSwap is completely free. We believe knowledge should be accessible to everyone.' },
  { q: 'How do I find the right match?', a: 'Browse skills or search users by skill. Our matching system helps you find complementary skill partners.' },
  { q: 'Can I swap multiple skills?', a: 'Absolutely! You can offer and request multiple skills on your profile.' },
];

const Home = () => {
  const [featuredSkills, setFeaturedSkills] = useState([]);
  const [stats, setStats] = useState({ users: 0, swaps: 0, reviews: 0 });
  const [loading, setLoading] = useState(true);
  const [openFaq, setOpenFaq] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [skillsRes, statsRes] = await Promise.all([
          skillAPI.getSkills({ featured: 'true', limit: 6 }),
          userAPI.getPublicStats(),
        ]);
        setFeaturedSkills(skillsRes.data.skills);
        setStats(statsRes.data.stats);
      } catch {
        /* use defaults */
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <>
      <SEO title="Home" description="Exchange skills and learn from each other on SkillSwap" />

      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary-50 via-white to-violet-50 dark:from-gray-950 dark:via-gray-900 dark:to-primary-950/30">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiM2MzY2ZjEiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMiIvPjwvZz48L2c+PC9zdmc+')] opacity-50" />
        <div className="relative mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8 lg:py-32">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mx-auto max-w-3xl text-center"
          >
            <span className="mb-6 inline-block rounded-full bg-primary-100 px-4 py-1.5 text-sm font-semibold text-primary-700 dark:bg-primary-900/50 dark:text-primary-300">
              🚀 The Future of Learning is Here
            </span>
            <h1 className="text-4xl font-extrabold tracking-tight sm:text-6xl lg:text-7xl">
              Exchange Skills,{' '}
              <span className="gradient-text">Grow Together</span>
            </h1>
            <p className="mt-6 text-lg text-gray-600 dark:text-gray-400 sm:text-xl">
              Connect with people who want to teach what you want to learn. No money needed — just pure knowledge exchange.
            </p>
            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link to="/register">
                <Button size="lg" className="gap-2">
                  Start Swapping <FiArrowRight />
                </Button>
              </Link>
              <Link to="/skills">
                <Button size="lg" variant="outline">Browse Skills</Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats */}
      <section className="border-y border-gray-200 bg-white py-16 dark:border-gray-800 dark:bg-gray-900">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
            {[
              { icon: FiUsers, value: stats.users || '1,000+', label: 'Active Users' },
              { icon: FiRepeat, value: stats.swaps || '500+', label: 'Skill Swaps' },
              { icon: FiStar, value: stats.reviews || '200+', label: 'Reviews' },
              { icon: FiUsers, value: '50+', label: 'Skill Categories' },
            ].map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="text-center"
              >
                <stat.icon className="mx-auto h-8 w-8 text-primary-600" />
                <p className="mt-2 text-3xl font-bold">{stat.value}</p>
                <p className="text-sm text-gray-500">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Skills */}
      <section className="py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-12 text-center">
            <h2 className="text-3xl font-bold sm:text-4xl">Featured Skills</h2>
            <p className="mt-4 text-gray-500">Discover popular skills being exchanged on our platform</p>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {loading
              ? Array.from({ length: 6 }).map((_, i) => <CardSkeleton key={i} />)
              : featuredSkills.map((skill, i) => <SkillCard key={skill._id} skill={skill} index={i} />)}
          </div>
          <div className="mt-12 text-center">
            <Link to="/skills"><Button variant="outline" size="lg">View All Skills</Button></Link>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="bg-gray-50 py-24 dark:bg-gray-900/50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="mb-12 text-center text-3xl font-bold">What Our Users Say</h2>
          <div className="grid gap-8 md:grid-cols-3">
            {testimonials.map((t, i) => (
              <motion.div
                key={t.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="rounded-2xl border border-gray-200 bg-white p-8 dark:border-gray-800 dark:bg-gray-900"
              >
                <p className="text-gray-600 dark:text-gray-400">"{t.text}"</p>
                <div className="mt-6 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-100 font-semibold text-primary-700 dark:bg-primary-900/50">
                    {t.avatar}
                  </div>
                  <div>
                    <p className="font-semibold">{t.name}</p>
                    <p className="text-sm text-gray-500">{t.role}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="rounded-3xl bg-gradient-to-r from-primary-600 to-violet-600 p-12 text-center text-white sm:p-16">
            <h2 className="text-3xl font-bold sm:text-4xl">Ready to Start Your Skill Journey?</h2>
            <p className="mx-auto mt-4 max-w-xl text-primary-100">
              Join thousands of learners and teachers. Your next skill swap is just a click away.
            </p>
            <Link to="/register" className="mt-8 inline-block">
              <Button size="lg" variant="secondary" className="shadow-xl">Create Free Account</Button>
            </Link>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="border-t border-gray-200 py-24 dark:border-gray-800">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <h2 className="mb-12 text-center text-3xl font-bold">Frequently Asked Questions</h2>
          <div className="space-y-4">
            {faqs.map((faq, i) => (
              <div key={i} className="rounded-2xl border border-gray-200 dark:border-gray-800">
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="flex w-full items-center justify-between p-6 text-left font-semibold"
                >
                  {faq.q}
                  <FiChevronDown className={`h-5 w-5 transition-transform ${openFaq === i ? 'rotate-180' : ''}`} />
                </button>
                {openFaq === i && (
                  <motion.p
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="px-6 pb-6 text-gray-500 dark:text-gray-400"
                  >
                    {faq.a}
                  </motion.p>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
};

export default Home;
