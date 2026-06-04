import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Trophy, Users, User, ChevronRight, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import { TRAINERS, Trainer } from '../constants';

export default function Home() {
  const [selectedTrainer, setSelectedTrainer] = useState<Trainer | null>(null);
  const trainingCards = [
    {
      title: 'Individuálne tréningy',
      description: 'Zamerané na techniku, silu a kondíciu prispôsobené vašej úrovni.',
      icon: <User className="text-brand-red" size={32} />,
    },
    {
      title: 'Skupinové tréningy',
      description: 'Motivačná atmosféra v menších skupinách.',
      icon: <Users className="text-brand-red" size={32} />,
    },
    {
      title: 'Príprava na súťaže',
      description: 'Intenzívny kemp pre aktívnych zápasníkov a tých, čo to myslia vážne.',
      icon: <Trophy className="text-brand-red" size={32} />,
    },
  ];

  const galleryPreview = [
    '/images/galeria1.jpg',
    '/images/galeria2.jpg',
    '/images/galeria3.jpg',
    '/images/galeria4.jpg',
  ];

  return (
    <div className="overflow-hidden">
      {/* Hero Section */}
      <section className="relative h-screen flex items-center bg-brand-black">
        <div className="absolute inset-0 z-0">
          <img
            src="/images/hero.jpg"
            alt="Kickbox training"
            className="w-full h-full object-cover opacity-30 grayscale"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-brand-black via-brand-black/60 to-transparent" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="max-w-4xl"
          >
            <span className="text-brand-red font-black uppercase tracking-[0.4em] text-sm md:text-base mb-6 block">
              Najmodernejší Kickbox Gym v Humennom
            </span>
            <h1 className="text-6xl sm:text-7xl md:text-[140px] font-black leading-[0.8] text-white flex flex-col mb-10 tracking-tighter">
              <span>RBK</span>
              <span className="text-brand-red">KICKBOX</span>
            </h1>
            <p className="text-lg md:text-xl text-brand-text-dim leading-relaxed max-w-xl">
              Profesionálne zázemie pre začiatočníkov aj elitných športovcov. Trénuj pod vedením odborníka.
            </p>
          </motion.div>
        </div>

        {/* Floating scroll indicator */}
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center opacity-50"
        >
          <span className="text-[10px] uppercase tracking-widest mb-2 font-display">Scroll</span>
          <div className="w-[1px] h-10 bg-white" />
        </motion.div>
      </section>

      {/* O mne / O Gyme Section */}
      <section className="py-24 bg-brand-black relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="relative aspect-[4/5] overflow-hidden rounded-sm group shadow-2xl"
            >
              <img
                src="/images/vybavenie1.jpg"
                alt="RBK Kickbox Gym"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 border-2 border-brand-red m-4 pointer-events-none opacity-50" />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-4xl sm:text-5xl md:text-7xl mb-8 flex flex-col leading-none">
                <span className="text-brand-red text-xs tracking-[0.4em] font-black mb-4">RBK</span>
                PROFESIONÁLNE ZÁZEMIE
              </h2>
              <div className="space-y-6 text-brand-text-dim text-lg leading-relaxed">
                <p>
                  Máme za sebou 25 rokov úspechov, stovky odtrénovaných hodín a nespočetné množstvo umiestnení na slovenskej aj svetovej scéne.
                </p>
                <p>
                  Náš klub vedie skúsený tréner Rastislav Babinčák, ktorý svoje vedomosti odovzdáva ďalším generáciám. Pridaj sa k tímu, ktorý má výsledky a tradíciu.
                </p>
                <div className="grid grid-cols-2 gap-8 pt-8 border-t border-white/5">
                  <div>
                    <h4 className="text-white font-black text-xs uppercase tracking-widest mb-4">Vybavenie</h4>
                    <ul className="text-sm space-y-2">
                        <li>• Profesionálny ring</li>
                        <li>• 10+ boxovacích vriec</li>
                        <li>• Crossfit zóna</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="text-white font-black text-xs uppercase tracking-widest mb-4">Vedenie</h4>
                    <ul className="text-sm space-y-2">
                        <li>• Certifikovaných tréner</li>
                        <li>• Aktívni závodníci</li>
                        
                    </ul>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Rozvrh skupinových tréningov */}
      <section className="py-24 bg-brand-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-16">
            <span className="text-brand-red text-xs tracking-[0.4em] font-black mb-4 block">Skupinové tréningy</span>
            <h2 className="text-4xl sm:text-5xl md:text-7xl mb-4">ROZVRH</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="border border-white/10 bg-brand-gray p-8"
            >
              <div className="mb-6 pb-6 border-b border-white/10">
                <span className="text-brand-red font-black text-xs uppercase tracking-[0.3em]">Pondelok / Streda / Piatok</span>
              </div>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-white font-black">👶 Detský tréning</p>
                    <p className="text-brand-text-dim text-sm mt-1">📍 ZŠ Labrocká</p>
                  </div>
                  <span className="text-brand-red font-black text-lg">17:00 – 18:00</span>
                </div>
                <div className="h-px bg-white/5" />
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-white font-black">🏅 Juniori</p>
                    <p className="text-brand-text-dim text-sm mt-1">📍 ZŠ Labrocká</p>
                  </div>
                  <span className="text-brand-red font-black text-lg">18:00 – 19:30</span>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="border border-white/10 bg-brand-gray p-8"
            >
              <div className="mb-6 pb-6 border-b border-white/10">
                <span className="text-brand-red font-black text-xs uppercase tracking-[0.3em]">Utorok / Štvrtok</span>
              </div>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-white font-black">♀ Ženy</p>
                    <p className="text-brand-text-dim text-sm mt-1">📍 Námestie slobody 69</p>
                  </div>
                  <span className="text-brand-red font-black text-lg">18:00 – 19:00</span>
                </div>
                <div className="h-px bg-white/5" />
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-white font-black">♂ Muži</p>
                    <p className="text-brand-text-dim text-sm mt-1">📍 Námestie slobody 69</p>
                  </div>
                  <span className="text-brand-red font-black text-lg">19:30 – 20:30</span>
                </div>
              </div>
            </motion.div>
          </div>

          <p className="text-brand-text-dim text-sm mt-8 text-center">
            Pre skupinové tréningy nie je potrebná rezervácia — príď priamo na miesto.
          </p>
        </div>
      </section>

      {/* Naši tréneri Section */}
      <section className="py-24 bg-brand-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mb-16">
                <span className="text-brand-red text-xs tracking-[0.4em] font-black mb-4 block">Odborníci</span>
                <h2 className="text-4xl sm:text-5xl md:text-7xl mb-4">TRÉNERI</h2>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {TRAINERS.map((trainer, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: i * 0.1 }}
                        className="group cursor-pointer"
                        onClick={() => setSelectedTrainer(trainer)}
                    >
                        <div className="aspect-[3/4] overflow-hidden mb-4 border border-white/5 transition-all duration-500 relative">
                            <img src={trainer.img} alt={trainer.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                                <span className="text-white text-xs font-black uppercase tracking-widest border border-white px-4 py-2">Zobraziť profil</span>
                            </div>
                        </div>
                        <h3 className="text-xl font-black text-white">{trainer.name}</h3>
                        <p className="text-brand-red text-xs uppercase tracking-widest font-black mb-4">{trainer.role}</p>
                        <Link to="/rezervacie" className="btn-primary text-xs py-3 px-6 w-full text-center block" onClick={e => e.stopPropagation()}>
                          Rezervovať termín
                        </Link>
                    </motion.div>
                ))}
            </div>
        </div>
      </section>

      {/* Moje tréningy Section */}
      <section className="py-24 bg-brand-gray relative overflow-hidden">
        <div className="absolute top-0 right-0 opacity-5 pointer-events-none -translate-y-1/2 translate-x-1/2">
          <span className="text-[20rem] font-display text-white">BOX</span>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="mb-16">
            <span className="text-brand-red text-xs tracking-[0.4em] font-black mb-4 block">Programy</span>
            <h2 className="text-4xl sm:text-5xl md:text-7xl mb-4">MOJE TRÉNINGY</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-0 border border-white/5">
            {trainingCards.map((card, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2 }}
                className="bg-brand-gray/50 p-10 border-r border-white/5 last:border-r-0 hover:bg-brand-gray transition-colors group"
              >
                <div className="mb-8 text-brand-red group-hover:scale-110 transition-transform inline-block">
                  {card.icon}
                </div>
                <h3 className="text-2xl mb-4 text-white uppercase font-black">{card.title}</h3>
                <p className="text-brand-text-dim leading-relaxed text-sm">{card.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Nábor CTA */}
      <section className="py-24 bg-brand-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative overflow-hidden border border-brand-red/40 bg-brand-gray p-8 sm:p-12 md:p-20 text-center">
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-5">
              <span className="text-[12rem] font-black text-white leading-none">RBK</span>
            </div>
            <div className="relative z-10">
              <span className="text-brand-red text-xs font-black uppercase tracking-[0.4em] mb-4 block">Nábor</span>
              <h2 className="text-3xl sm:text-4xl md:text-7xl font-black text-white uppercase mb-4 leading-tight">
                Vymeň stres<br />za rukavice
              </h2>
              <p className="text-gray-400 text-lg mb-4 max-w-xl mx-auto">
                Hľadáme nových členov do našich skupín. Nečakaj na „pondelok".
              </p>
              <p className="text-white text-xl font-black mb-10">
                Prvý tréning máš u nás ZDARMA!
              </p>
              <Link to="/kontakt" className="btn-primary inline-flex items-center">
                Príď si to vyskúšať
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Galerie Preview Section */}
      <section className="py-24 bg-brand-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-end mb-12">
            <h2 className="text-5xl md:text-6xl mb-4 md:mb-0">UKÁŽKA TRÉNINGOV</h2>
            <Link to="/galeria" className="flex items-center text-brand-red hover:text-white transition-colors font-display text-xl uppercase tracking-wider group">
              Zobraziť celú galériu <ChevronRight className="ml-1 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {galleryPreview.map((src, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="img-hover-zoom aspect-[4/5]"
              >
                <img src={src} alt="Kickbox prep" className="w-full h-full object-cover transition-all duration-700" />
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      {/* Trainer Modal */}
      <AnimatePresence>
        {selectedTrainer && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 px-4"
            onClick={() => setSelectedTrainer(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-brand-gray border border-white/10 max-w-lg w-full overflow-hidden relative"
              onClick={e => e.stopPropagation()}
            >
              <button
                onClick={() => setSelectedTrainer(null)}
                className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors z-10"
              >
                <X size={24} />
              </button>
              <div className="flex flex-col sm:flex-row">
                <div className="sm:w-48 aspect-[3/4] sm:aspect-auto flex-shrink-0">
                  <img src={selectedTrainer.img} alt={selectedTrainer.name} className="w-full h-full object-cover" />
                </div>
                <div className="p-8 flex flex-col justify-center">
                  <span className="text-brand-red text-xs uppercase tracking-[0.3em] font-black mb-2">{selectedTrainer.role}</span>
                  <h3 className="text-2xl font-black text-white mb-6">{selectedTrainer.name}</h3>
                  {selectedTrainer.achievements.length > 0 && (
                    <ul className="space-y-3">
                      {selectedTrainer.achievements.map((a, i) => (
                        <li key={i} className="flex items-start gap-3 text-sm text-brand-text-dim">
                          <span className="text-brand-red font-black mt-0.5">—</span>
                          {a}
                        </li>
                      ))}
                    </ul>
                  )}
                  <Link to="/rezervacie" className="btn-primary text-xs py-3 px-6 text-center mt-8 block" onClick={() => setSelectedTrainer(null)}>
                    Rezervovať termín
                  </Link>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
