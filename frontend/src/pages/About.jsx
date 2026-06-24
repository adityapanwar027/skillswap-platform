import { motion } from 'framer-motion';
import { FiTarget, FiHeart, FiGlobe } from 'react-icons/fi';
import SEO from '../components/SEO';

const About = () => (
  <>
    <SEO title="About" description="Learn about SkillSwap's mission to make knowledge exchange accessible to everyone" />
    <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mx-auto max-w-3xl text-center">
        <h1 className="text-4xl font-bold sm:text-5xl">About <span className="gradient-text">SkillSwap</span></h1>
        <p className="mt-6 text-lg text-gray-600 dark:text-gray-400">
          We're on a mission to democratize learning by connecting people who want to teach with those eager to learn.
        </p>
      </motion.div>

      <div className="mt-20 grid gap-12 md:grid-cols-3">
        {[
          { icon: FiTarget, title: 'Our Mission', desc: 'Make skill exchange accessible to everyone, everywhere. No barriers, no fees — just knowledge sharing.' },
          { icon: FiHeart, title: 'Our Values', desc: 'Community, reciprocity, and growth. We believe everyone has something valuable to teach and learn.' },
          { icon: FiGlobe, title: 'Our Vision', desc: 'A world where learning is collaborative, personalized, and powered by human connection.' },
        ].map((item, i) => (
          <motion.div
            key={item.title}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            className="rounded-2xl border border-gray-200 bg-white p-8 text-center dark:border-gray-800 dark:bg-gray-900"
          >
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary-50 dark:bg-primary-900/30">
              <item.icon className="h-7 w-7 text-primary-600" />
            </div>
            <h3 className="text-xl font-bold">{item.title}</h3>
            <p className="mt-3 text-gray-500 dark:text-gray-400">{item.desc}</p>
          </motion.div>
        ))}
      </div>

      <div className="mt-20 rounded-3xl bg-gray-50 p-12 dark:bg-gray-900/50">
        <h2 className="text-2xl font-bold">Our Story</h2>
        <p className="mt-4 text-gray-600 dark:text-gray-400 leading-relaxed">
          SkillSwap was born from a simple idea: what if you could trade your expertise for someone else's?
          We noticed that traditional learning platforms often come with high costs and rigid structures.
          SkillSwap breaks those barriers by creating a peer-to-peer marketplace for knowledge exchange.
          Whether you're a developer wanting to learn guitar, or a chef interested in photography —
          there's someone out there ready to swap skills with you.
        </p>
      </div>
    </div>
  </>
);

export default About;
