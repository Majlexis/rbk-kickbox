import { useState, useEffect } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, Lock } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsOpen(false);
  }, [location]);

  if (location.pathname.startsWith('/admin')) return null;

  const navLinks = [
    { name: 'Domov', path: '/' },
    { name: 'Galéria', path: '/galeria' },
    { name: 'Cenník', path: '/cennik' },
    { name: 'Rezervácie', path: '/rezervacie' },
    { name: 'Kontakt', path: '/kontakt' },
    { name: '2% z daní', path: '/2-percenta' },
  ];

  return (
    <nav className={`fixed w-full z-50 transition-all duration-300 ${scrolled ? 'bg-brand-black/95 py-3 shadow-lg' : 'bg-transparent py-5'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          <NavLink to="/" className="flex items-center space-x-2 group">
            <span className="font-black text-2xl tracking-tighter text-white uppercase italic">
              RBK <span className="text-brand-red">KICKBOX</span>
            </span>
          </NavLink>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center space-x-10">
            {navLinks.map((link) => (
              <NavLink
                key={link.path}
                to={link.path}
                className={({ isActive }) =>
                  `font-black text-sm tracking-[0.2em] uppercase transition-colors hover:text-brand-red ${isActive ? 'text-brand-red' : 'text-white'}`
                }
              >
                {link.name}
              </NavLink>
            ))}
            <button
              onClick={() => navigate('/admin/login')}
              title="Admin prihlásenie"
              className="text-gray-600 hover:text-white transition-colors ml-2">
              <Lock size={18} />
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center gap-4">
            <button
              onClick={() => navigate('/admin/login')}
              title="Admin prihlásenie"
              className="text-gray-600 hover:text-white transition-colors">
              <Lock size={18} />
            </button>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-white hover:text-brand-red transition-colors"
              aria-label="Menu"
            >
              {isOpen ? <X size={32} /> : <Menu size={32} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Nav */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-brand-gray border-b border-white/10"
          >
            <div className="px-4 pt-2 pb-6 space-y-4">
              {navLinks.map((link) => (
                <NavLink
                  key={link.path}
                  to={link.path}
                  className={({ isActive }) =>
                    `block font-display text-2xl tracking-wide py-2 ${isActive ? 'text-brand-red' : 'text-white'}`
                  }
                >
                  {link.name}
                </NavLink>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
