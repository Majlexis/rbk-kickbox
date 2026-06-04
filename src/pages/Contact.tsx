import { useState } from 'react';
import { motion } from 'motion/react';
import { Mail, Phone, MapPin, Facebook, Send, CheckCircle, AlertCircle } from 'lucide-react';

type Status = 'idle' | 'loading' | 'success' | 'error';

export default function Contact() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState<Status>('idle');

  const contactInfo = [
    {
      icon: <Phone size={22} />,
      label: 'Telefón',
      value: '+421 905 230 732',
      href: 'tel:+421905230732',
    },
    {
      icon: <Mail size={22} />,
      label: 'Email',
      value: 'rbkkickbox@gmail.com',
      href: 'mailto:rbkkickbox@gmail.com',
    },
    {
      icon: <Facebook size={22} />,
      label: 'Facebook',
      value: 'Kickbox Humenné',
      href: 'https://www.facebook.com/profile.php?id=100063718955131&mibextid=wwXIfr&rdid=XO7h45Gi7sJ8vRv1&share_url=https%3A%2F%2Fwww.facebook.com%2Fshare%2F1D4eRCV8N5%2F%3Fmibextid%3DwwXIfr#',
    },
  ];

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus('loading');

    try {
      const res = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/send-contact-email`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
          },
          body: JSON.stringify({ name, email, message }),
        }
      );

      if (!res.ok) throw new Error('Chyba pri odosielaní');

      setStatus('success');
      setName('');
      setEmail('');
      setMessage('');
    } catch {
      setStatus('error');
    }
  }

  return (
    <div className="pt-24 sm:pt-32 pb-16 sm:pb-24 bg-brand-black min-h-screen relative overflow-hidden">
      <div className="absolute top-1/4 right-0 w-64 sm:w-96 h-64 sm:h-96 bg-brand-red/10 rounded-full blur-[120px] -z-1" />
      <div className="absolute bottom-0 left-0 w-48 sm:w-64 h-48 sm:h-64 bg-brand-red/10 rounded-full blur-[100px] -z-1" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

        {/* Nadpis */}
        <section className="mb-10 sm:mb-16">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl sm:text-7xl md:text-9xl mb-3 leading-none"
          >
            PRIDAJ SA K NÁM
          </motion.h1>
          <p className="text-brand-red text-xs uppercase tracking-[0.3em] sm:tracking-[0.4em] font-black">
            ACADEMY JE OTVORENÁ PRE KAŽDÉHO
          </p>
        </section>

        {/* Kontaktné karty */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10 sm:mb-12"
        >
          {contactInfo.map((info, index) => (
            <a
              key={index}
              href={info.href}
              target="_blank"
              rel="noopener noreferrer"
              className="card-dark group hover:border-brand-red transition-all flex items-center gap-4 sm:flex-col sm:items-start sm:gap-0"
            >
              <div className="text-brand-red sm:mb-4 group-hover:scale-110 transition-transform flex-shrink-0">
                {info.icon}
              </div>
              <div>
                <h3 className="font-display text-sm sm:text-xl text-gray-500 uppercase tracking-widest mb-0.5">{info.label}</h3>
                <p className="text-white font-medium text-base sm:text-lg break-all">{info.value}</p>
              </div>
            </a>
          ))}
        </motion.div>

        {/* Formulár */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-16 mb-10 sm:mb-16">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="flex flex-col justify-center"
          >
            <h2 className="text-3xl sm:text-4xl font-black text-white uppercase mb-3">Napíš nám</h2>
            <p className="text-gray-400 text-base sm:text-lg leading-relaxed">
              Máš otázku ohľadom tréningov, cien alebo začiatku? Neváhaj nás kontaktovať — odpíšeme čo najskôr.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            {status === 'success' ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="card-dark flex flex-col items-center justify-center text-center py-12 sm:py-16 space-y-4 sm:space-y-6"
              >
                <CheckCircle size={60} className="text-green-400" />
                <h2 className="text-3xl sm:text-4xl font-black text-white uppercase">Ďakujeme!</h2>
                <p className="text-gray-400 text-base sm:text-lg max-w-sm">
                  Správa bola úspešne odoslaná. Ozveme sa ti čo najskôr.
                </p>
                <button onClick={() => setStatus('idle')} className="btn-primary">
                  Odoslať ďalšiu správu
                </button>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="card-dark space-y-5">
                <div className="space-y-2">
                  <label className="text-xs sm:text-sm uppercase tracking-widest font-display text-gray-400">Meno a priezvisko</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Michal Kováč"
                    className="w-full bg-brand-black border border-white/10 rounded-sm py-3 sm:py-4 px-4 sm:px-6 text-white focus:border-brand-red outline-none transition-all text-base"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs sm:text-sm uppercase tracking-widest font-display text-gray-400">Váš Email</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="michal@priklad.sk"
                    className="w-full bg-brand-black border border-white/10 rounded-sm py-3 sm:py-4 px-4 sm:px-6 text-white focus:border-brand-red outline-none transition-all text-base"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs sm:text-sm uppercase tracking-widest font-display text-gray-400">Vaša správa</label>
                  <textarea
                    required
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Dobrý deň, mal by som záujem o..."
                    rows={5}
                    className="w-full bg-brand-black border border-white/10 rounded-sm py-3 sm:py-4 px-4 sm:px-6 text-white focus:border-brand-red outline-none transition-all resize-none text-base"
                  />
                </div>

                {status === 'error' && (
                  <div className="flex items-center gap-2 text-brand-red text-sm font-black uppercase tracking-widest">
                    <AlertCircle size={18} /> Nastala chyba, skús to znova.
                  </div>
                )}

                <button
                  type="submit"
                  disabled={status === 'loading'}
                  className="btn-primary w-full flex justify-center items-center group disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {status === 'loading' ? 'Odosielam...' : 'Odoslať správu'}
                  {status !== 'loading' && (
                    <Send className="ml-2 group-hover:translate-x-1 transition-transform" size={20} />
                  )}
                </button>
              </form>
            )}
          </motion.div>
        </div>

        {/* Lokality */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="card-dark border-brand-red/30"
          >
            <h3 className="text-lg sm:text-xl font-display text-white mb-4 uppercase">Kde trénujeme?</h3>
            <div className="flex items-start space-x-3 mb-4">
              <MapPin size={18} className="text-brand-red mt-1 flex-shrink-0" />
              <div>
                <p className="text-white font-black">ZŠ Laborecká</p>
                <p className="text-sm text-gray-400">Humenné</p>
                <p className="text-sm text-gray-400">Vchod z basketbalového ihriska</p>
                <p className="text-xs text-brand-red font-black uppercase tracking-widest mt-2">Pondelok • Streda • Piatok</p>
              </div>
            </div>
            <div className="overflow-hidden rounded-sm border border-white/10">
              <iframe
                src="https://maps.google.com/maps?q=ZS+Laborecka+Humenne+Slovakia&output=embed"
                width="100%"
                height="220"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="card-dark border-brand-red/30"
          >
            <h3 className="text-lg sm:text-xl font-display text-white mb-4 uppercase">Kde trénujeme?</h3>
            <div className="flex items-start space-x-3 mb-4">
              <MapPin size={18} className="text-brand-red mt-1 flex-shrink-0" />
              <div>
                <p className="text-white font-black">Námestie slobody 69</p>
                <p className="text-sm text-gray-400">Humenné</p>
                <p className="text-sm text-gray-400">Vstup cez firmu Montter cez bránu</p>
                <p className="text-xs text-brand-red font-black uppercase tracking-widest mt-2">Utorok • Štvrtok</p>
              </div>
            </div>
            <div className="overflow-hidden rounded-sm border border-white/10">
              <iframe
                src="https://maps.google.com/maps?q=Namestie+slobody+69+Humenne+Slovakia&output=embed"
                width="100%"
                height="220"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </motion.div>
        </div>

      </div>
    </div>
  );
}
