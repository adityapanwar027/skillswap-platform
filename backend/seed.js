import dotenv from 'dotenv';
import mongoose from 'mongoose';
import User from '../models/User.js';
import Skill from '../models/Skill.js';

dotenv.config();

const skills = [
  { name: 'JavaScript', category: 'Technology', icon: '⚡', description: 'Modern web development with JS', isFeatured: true },
  { name: 'React', category: 'Technology', icon: '⚛️', description: 'Building interactive UIs', isFeatured: true },
  { name: 'Python', category: 'Technology', icon: '🐍', description: 'Versatile programming language', isFeatured: true },
  { name: 'UI/UX Design', category: 'Design', icon: '🎨', description: 'User interface and experience design', isFeatured: true },
  { name: 'Graphic Design', category: 'Design', icon: '✏️', description: 'Visual communication and branding', isFeatured: false },
  { name: 'Spanish', category: 'Languages', icon: '🇪🇸', description: 'Learn conversational Spanish', isFeatured: true },
  { name: 'French', category: 'Languages', icon: '🇫🇷', description: 'Master the French language', isFeatured: false },
  { name: 'Guitar', category: 'Music', icon: '🎸', description: 'Acoustic and electric guitar', isFeatured: true },
  { name: 'Piano', category: 'Music', icon: '🎹', description: 'Classical and modern piano', isFeatured: false },
  { name: 'Photography', category: 'Arts', icon: '📷', description: 'Digital and film photography', isFeatured: true },
  { name: 'Yoga', category: 'Fitness', icon: '🧘', description: 'Mind-body wellness practice', isFeatured: false },
  { name: 'Cooking', category: 'Cooking', icon: '👨‍🍳', description: 'Culinary arts and techniques', isFeatured: true },
  { name: 'Marketing', category: 'Business', icon: '📈', description: 'Digital marketing strategies', isFeatured: false },
  { name: 'Public Speaking', category: 'Education', icon: '🎤', description: 'Confident communication skills', isFeatured: true },
  { name: 'Data Analysis', category: 'Technology', icon: '📊', description: 'Analytics and insights', isFeatured: false },
];

const seed = async () => {
  await mongoose.connect(process.env.MONGO_URI);
  console.log('Connected to MongoDB');

  await User.deleteMany({ email: { $in: ['admin@skillswap.com', 'demo@skillswap.com'] } });
  await Skill.deleteMany({});

  await User.create({
    name: 'Admin User',
    email: 'admin@skillswap.com',
    password: 'admin123',
    role: 'admin',
    bio: 'SkillSwap platform administrator',
    location: 'San Francisco, CA',
  });

  await User.create({
    name: 'Demo User',
    email: 'demo@skillswap.com',
    password: 'demo123',
    bio: 'Passionate learner and teacher. Love sharing knowledge!',
    location: 'New York, NY',
    skillsOffered: [
      { name: 'JavaScript', level: 'advanced', description: '5 years of full-stack experience' },
      { name: 'React', level: 'expert', description: 'Built multiple production apps' },
    ],
    skillsWanted: [
      { name: 'Spanish', level: 'beginner', description: 'Want to learn conversational Spanish' },
      { name: 'Photography', level: 'intermediate', description: 'Improve portrait photography' },
    ],
  });

  await Skill.insertMany(skills);
  console.log('Database seeded successfully!');
  console.log('Admin: admin@skillswap.com / admin123');
  console.log('Demo: demo@skillswap.com / demo123');
  process.exit(0);
};

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
