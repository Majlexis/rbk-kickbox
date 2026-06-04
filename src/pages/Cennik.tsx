import { motion } from 'motion/react';
import { Check, Gift } from 'lucide-react';
import { Link } from 'react-router-dom';

const plans = [
  {
    name: 'Deti',
    subtitle: 'Vek 6–12 rokov',
    days: 'Pondelok • Streda • Piatok',
    time: '17:00 – 18:00',
    price: '25',
    unit: '€ / mesiac',
    items: [
      'Základy kickboxu a sebaobrana',
      'Rozvoj koordinácie a kondície',
      'Tréning v bezpečnom prostredí',
      'Skúsený tréner',
    ],
    highlight: false,
    ctaLabel: 'Kontaktovať',
    ctaLink: '/kontakt',
  },
  {
    name: 'Juniori',
    subtitle: 'Vek 13–17 rokov',
    days: 'Pondelok • Streda • Piatok',
    time: '18:00 – 19:30',
    price: '25',
    unit: '€ / mesiac',
    items: [
      'Technika a taktika kickboxu',
      'Kondičná príprava',
      'Príprava na súťaže',
      'Mentálna odolnosť',
    ],
    highlight: false,
    ctaLabel: 'Kontaktovať',
    ctaLink: '/kontakt',
  },
  {
    name: 'Skupinový tréning',
    subtitle: 'Muži & Ženy',
    days: 'Utorok • Štvrtok',
    time: '18:00 – 20:30',
    price: '40',
    unit: '€ / mesiac',
    subPrice: '7',
    subUnit: '€ / tréning',
    items: [
      'Tréning pre mužov aj ženy',
      'Technika, kondícia a sparring',
      'Sebaobrana a formovanie postavy',
      'Všetky úrovne vítané',
    ],
    highlight: true,
    ctaLabel: 'Kontaktovať',
    ctaLink: '/kontakt',
  },
  {
    name: 'Súkromný tréning',
    subtitle: 'Individuálny prístup',
    days: 'Podľa dohody',
    time: 'Flexibilný čas',
    price: '15',
    unit: '€ / tréning',
    items: [
      'Tréning šitý na mieru',
      'Plná pozornosť trénera',
      'Rýchlejší progres',
      'Vlastný termín',
    ],
    highlight: false,
    ctaLabel: 'Rezervovať termín',
    ctaLink: '/rezervacie',
  },
];

export default function Cennik() {
  return (
    <div className="pt-32 pb-24 bg-brand-black min-h-screen relative overflow-hidden">
      <div className="absolute top-1/4 right-0 w-96 h-96 bg-brand-red/10 rounded-full blur-[120px] -z-1" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-brand-red/10 rounded-full blur-[100px] -z-1" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <section className="mb-16">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl sm:text-7xl md:text-9xl mb-4 leading-none"
          >
            CENNÍK
          </motion.h1>
          <p className="text-brand-red text-xs uppercase tracking-[0.4em] font-black">
            Vyber si tréning, ktorý ti vyhovuje
          </p>
        </section>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-12 border border-brand-red/50 bg-brand-red/10 rounded-sm px-6 py-5"
        >
          <Gift size={28} className="text-brand-red flex-shrink-0" />
          <div>
            <p className="text-white font-black text-lg uppercase tracking-wide">Prvý tréning zadarmo!</p>
            <p className="text-gray-400 text-sm mt-0.5">Príď vyskúšať — bez záväzkov, bez platby. Prvý tréning je na nás.</p>
          </div>
          <Link
            to="/kontakt"
            className="sm:ml-auto flex-shrink-0 bg-brand-red text-white text-xs font-black uppercase tracking-widest px-5 py-3 hover:bg-brand-red/80 transition-all"
          >
            Kontaktovať
          </Link>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {plans.map((plan, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className={`relative flex flex-col border rounded-sm p-8
                ${plan.highlight
                  ? 'bg-brand-red border-brand-red'
                  : 'bg-brand-gray border-white/10'}`}
            >
              {plan.highlight && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-white text-brand-red text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full">
                  Najpopulárnejší
                </span>
              )}

              <div className="mb-6">
                <h2 className="text-2xl font-black text-white uppercase">{plan.name}</h2>
                <p className={`text-xs font-black uppercase tracking-widest mt-1 ${plan.highlight ? 'text-white/70' : 'text-gray-500'}`}>
                  {plan.subtitle}
                </p>
              </div>

              <div className="mb-6">
                <div className="flex items-end gap-1">
                  <span className="text-5xl font-black text-white">{plan.price}</span>
                  <span className={`text-sm font-black mb-2 ${plan.highlight ? 'text-white/70' : 'text-gray-500'}`}>{plan.unit}</span>
                </div>
                {'subPrice' in plan ? (
                  <p className={`text-sm font-bold mt-1 ${plan.highlight ? 'text-white/60' : 'text-gray-500'}`}>
                    {(plan as any).subPrice} {(plan as any).subUnit}
                  </p>
                ) : (
                  <p className="text-sm mt-1 invisible">&nbsp;</p>
                )}
              </div>

              <div className={`text-xs font-black uppercase tracking-widest mb-6 ${plan.highlight ? 'text-white/80' : 'text-brand-red'}`}>
                <p>{plan.days}</p>
                <p className="mt-1">{plan.time}</p>
              </div>

              <ul className="space-y-3 mb-8 flex-grow">
                {plan.items.map((item, j) => (
                  <li key={j} className="flex items-start gap-3">
                    <Check size={16} className={`mt-0.5 flex-shrink-0 ${plan.highlight ? 'text-white' : 'text-brand-red'}`} />
                    <span className={`text-sm ${plan.highlight ? 'text-white/90' : 'text-gray-400'}`}>{item}</span>
                  </li>
                ))}
              </ul>

              <Link
                to={plan.ctaLink}
                className={`text-center text-xs font-black uppercase tracking-widest py-3 px-6 transition-all
                  ${plan.highlight
                    ? 'bg-white text-brand-red hover:bg-white/90'
                    : 'bg-brand-red text-white hover:bg-brand-red/80'}`}
              >
                {plan.ctaLabel}
              </Link>
            </motion.div>
          ))}
        </div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="text-center text-gray-600 text-xs uppercase tracking-widest mt-12"
        >
          Ceny sú informatívne — pre aktuálne info nás kontaktuj
        </motion.p>

        {/* Nábor CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="mt-20 relative overflow-hidden border border-brand-red/40 bg-brand-gray rounded-sm p-12 text-center"
        >
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-5">
            <span className="text-[12rem] font-black text-white leading-none">RBK</span>
          </div>
          <div className="relative z-10">
            <span className="text-brand-red text-xs font-black uppercase tracking-[0.4em] mb-4 block">
              Nábor
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-6xl font-black text-white uppercase mb-4 leading-tight">
              Chceš sa k nám<br />pridať?
            </h2>
            <p className="text-gray-400 text-lg mb-10 max-w-xl mx-auto">
              Nezáleží na veku ani skúsenostiach — vitajú nás všetci. Napíš nám a my ti povieme všetko, čo potrebuješ vedieť.
            </p>
            <Link
              to="/kontakt"
              className="btn-primary inline-flex items-center text-sm"
            >
              Kontaktuj nás
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
