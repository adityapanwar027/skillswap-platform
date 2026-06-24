import { Link } from 'react-router-dom';
import { FiGithub, FiTwitter, FiLinkedin, FiMail } from 'react-icons/fi';

const Footer = () => (
  <footer className="border-t border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-950">
    <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="grid gap-12 md:grid-cols-4">
        <div className="md:col-span-1">
          <Link to="/" className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-primary-500 to-violet-600 text-white font-bold">
              S
            </div>
            <span className="text-xl font-bold gradient-text">SkillSwap</span>
          </Link>
          <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">
            Exchange skills, grow together. Connect with people who want to teach what you want to learn.
          </p>
          <div className="mt-6 flex gap-4">
            {[FiTwitter, FiGithub, FiLinkedin, FiMail].map((Icon, i) => (
              <a key={i} href="#" className="text-gray-400 hover:text-primary-600 transition-colors">
                <Icon className="h-5 w-5" />
              </a>
            ))}
          </div>
        </div>

        {[
          { title: 'Platform', links: [{ to: '/skills', label: 'Browse Skills' }, { to: '/register', label: 'Sign Up' }, { to: '/login', label: 'Login' }] },
          { title: 'Company', links: [{ to: '/about', label: 'About Us' }, { to: '/contact', label: 'Contact' }] },
          { title: 'Legal', links: [{ to: '#', label: 'Privacy Policy' }, { to: '#', label: 'Terms of Service' }] },
        ].map((section) => (
          <div key={section.title}>
            <h4 className="mb-4 font-semibold">{section.title}</h4>
            <ul className="space-y-3">
              {section.links.map((link) => (
                <li key={link.label}>
                  <Link to={link.to} className="text-sm text-gray-500 hover:text-primary-600 dark:text-gray-400">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="mt-12 border-t border-gray-200 pt-8 text-center text-sm text-gray-500 dark:border-gray-800">
        © {new Date().getFullYear()} SkillSwap. All rights reserved.
      </div>
    </div>
  </footer>
);

export default Footer;
