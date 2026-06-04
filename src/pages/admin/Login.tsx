import { useState } from 'react';
import { motion } from 'motion/react';
import { supabase } from '../../supabase';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  async function handleLogin() {
    setLoading(true);
    setError('');
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      setError('Nesprávny email alebo heslo');
    } else {
      navigate('/admin');
    }
    setLoading(false);
  }

  return (
    <div className="min-h-screen bg-brand-black flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-brand-gray border border-white/5 p-8 rounded-sm"
      >
        <h1 className="text-4xl font-black text-white uppercase mb-2">Admin</h1>
        <p className="text-brand-red text-xs uppercase tracking-widest mb-8">Prihlásenie trénera</p>

        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

        <div className="space-y-4">
          <div>
            <label className="text-xs uppercase tracking-widest text-gray-400 mb-2 block">Email</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)}
              className="w-full bg-brand-black border border-white/10 py-3 px-4 text-white focus:border-brand-red outline-none rounded-sm" />
          </div>
          <div>
            <label className="text-xs uppercase tracking-widest text-gray-400 mb-2 block">Heslo</label>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleLogin()}
              className="w-full bg-brand-black border border-white/10 py-3 px-4 text-white focus:border-brand-red outline-none rounded-sm" />
          </div>
          <button onClick={handleLogin} disabled={loading}
            className="btn-primary w-full text-center mt-4">
            {loading ? 'Prihlasujem...' : 'Prihlásiť sa'}
          </button>
        </div>
      </motion.div>
    </div>
  );
}