import { useLocation } from 'react-router-dom';

export default function Footer() {
  const location = useLocation();
  const currentYear = new Date().getFullYear();

  if (location.pathname.startsWith('/admin')) return null;

  return (
    <footer className="bg-brand-gray border-t border-white/5 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center space-y-6 md:space-y-0 text-[10px] uppercase tracking-[0.2em] font-black text-brand-text-dim">
          <div>
            &copy; {currentYear} RBK KICKBOX. VŠETKY PRÁVA VYHRADENÉ.
          </div>
          <div className="flex flex-wrap justify-center gap-8">
            <span className="flex items-center gap-2">
              <span className="text-brand-red">EMAIL:</span> rbkkickbox@gmail.com
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
