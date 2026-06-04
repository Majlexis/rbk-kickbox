import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { Download, Heart } from 'lucide-react';

const steps = {
  zamestnanec: [
    'Do <strong>15. februára</strong> požiadajte zamestnávateľa o vykonanie ročného zúčtovania zaplatených preddavkov na daň a o vystavenie <strong>Potvrdenia o zaplatení dane z príjmov zo závislej činnosti</strong>.',
    'Vyplňte tlačivo <strong>Vyhlásenie o poukázaní podielu zaplatenej dane z príjmov fyzickej osoby</strong>.',
    'Do <strong>30. apríla</strong> doručte obe tlačivá na daňový úrad podľa vášho bydliska.',
    'Pri odovzdaní si prosím spravte kópiu opečiatkovaného POTVRDENIA. Kópiu s opečiatkovaným POTVRDENÍM pošlite na e-mail <strong>rbkkickbox@gmail.com</strong>.',
  ],
  fyzicka: [
    'Vyplňte v Daňovom priznaní pre fyzické osoby kolónky na poukázanie <strong>2 % z dane z príjmu</strong>.',
    'Daňové priznanie k dani z príjmov za zdaňovacie obdobie roku 2025 je fyzická osoba povinná podať v lehote do <strong>31. marca 2026</strong> (resp. v predĺženej lehote na podanie daňového priznania, t. j. do 30. 06. 2026 alebo 30. 09. 2026).',
  ],
  pravnicka: [
    'Vyplňte v Daňovom priznaní pre právnické osoby <strong>kolónky na poukázanie 2 % z dane z príjmu</strong>.',
    'Lehota na podanie daňového priznania k dani z príjmov právnických osôb za zdaňovacie obdobie roku 2025 uplynie <strong>31. marca 2026</strong> (resp. v predĺženej lehote na podanie daňového priznania, t. j. do 30. 06. 2026 alebo 30. 09. 2026).',
  ],
};

export default function DveProcenta() {
  return (
    <div className="bg-brand-black min-h-screen overflow-hidden">

      {/* Hero */}
      <section className="relative h-screen flex items-center justify-center">
        <div className="absolute inset-0 z-0">
          <img
            src="/images/hero.jpg"
            alt="RBK Kickbox"
            className="w-full h-full object-cover opacity-25 grayscale"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-brand-black/60 via-brand-black/40 to-brand-black" />
        </div>
        <div className="relative z-10 text-center px-4">
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-brand-red text-xs uppercase tracking-[0.4em] font-black mb-4"
          >
            Podporte nás
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-6xl md:text-9xl font-black text-white uppercase leading-none"
          >
            VAŠE 2%
          </motion.h1>
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-4xl md:text-7xl font-black text-brand-red uppercase leading-none mt-2"
          >
            NÁM POMÔŽU.
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-gray-400 text-lg mt-8 max-w-xl mx-auto"
          >
            Vďaka Vám môžeme zlepšiť podmienky a skvalitniť tréningový proces v klube.
            Prosím, nenechajte ich prepadnúť štátu.
          </motion.p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">

        {/* Údaje + Vyhlásenie */}
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="grid md:grid-cols-2 gap-10 mb-20"
        >
          <div className="border border-white/10 bg-brand-gray rounded-sm p-10">
            <p className="text-brand-red text-xs font-black uppercase tracking-[0.3em] mb-6">Údaje o nás</p>
            <ul className="space-y-3 text-gray-300 text-sm">
              <li><span className="text-white font-black">IČO:</span> 36159191</li>
              <li><span className="text-white font-black">Obchodné meno:</span> RBK kickbox Humenne</li>
              <li><span className="text-white font-black">Právna forma:</span> Občianske združenie</li>
              <li><span className="text-white font-black">Sídlo:</span> Partizanska 2503/17 Humenne</li>
            </ul>
          </div>

          <div className="border border-brand-red/40 bg-brand-red/10 rounded-sm p-10 flex flex-col justify-between">
            <div>
              <p className="text-brand-red text-xs font-black uppercase tracking-[0.3em] mb-4">Vyhlásenie</p>
              <p className="text-gray-300 text-sm leading-relaxed">
                Stiahnite si vyhlásenie o poukázaní podielu zaplatenej dane.
                Vyplňte ho a odovzdajte na daňový úrad spolu s Potvrdením od zamestnávateľa.
              </p>
            </div>
            <a
              href="/vyhlasenie.pdf"
              download
              className="mt-8 inline-flex items-center gap-3 bg-brand-red text-white text-xs font-black uppercase tracking-widest px-6 py-4 hover:bg-brand-red/80 transition-all self-start"
            >
              <Download size={16} />
              Stiahnuť vyhlásenie
            </a>
          </div>
        </motion.section>

        {/* Postup */}
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-20"
        >
          <p className="text-brand-red text-xs uppercase tracking-[0.4em] font-black mb-3">Ako na to</p>
          <h2 className="text-5xl md:text-7xl font-black text-white uppercase mb-12">POSTUP</h2>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              { title: 'Zamestnanec', steps: steps.zamestnanec },
              { title: 'Fyzická osoba', steps: steps.fyzicka },
              { title: 'Právnická osoba', steps: steps.pravnicka },
            ].map((col, i) => (
              <motion.div
                key={col.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="border border-white/10 bg-brand-gray rounded-sm p-8"
              >
                <p className="text-brand-red text-xs font-black uppercase tracking-[0.3em] mb-6">{col.title}</p>
                <ol className="space-y-4">
                  {col.steps.map((step, j) => (
                    <li key={j} className="flex gap-3">
                      <span className="text-brand-red font-black text-sm flex-shrink-0">{j + 1}.</span>
                      <span
                        className="text-gray-300 text-sm leading-relaxed"
                        dangerouslySetInnerHTML={{ __html: step }}
                      />
                    </li>
                  ))}
                </ol>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Prečo to robíme */}
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-20 relative overflow-hidden border border-white/10 bg-brand-gray rounded-sm p-12 md:p-16"
        >
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-5">
            <span className="text-[12rem] font-black text-white leading-none">RBK</span>
          </div>
          <div className="relative z-10 text-center max-w-2xl mx-auto">
            <p className="text-brand-red text-xs font-black uppercase tracking-[0.4em] mb-4">Prečo to robíme</p>
            <h3 className="text-4xl md:text-5xl font-black text-white uppercase leading-tight mb-6">
              VAŠE 2% VYUŽIJEME<br />NA NÁŠ RAST
            </h3>
            <p className="text-gray-400 text-lg leading-relaxed">
              Vaše 2% pomôžu našim zverenciam v skvalitnení tréningového procesu,
              formou nákupu cvičebných a tréningových pomôcok, účasťou na súťažiach
              a rozvoja klubu.
            </p>
          </div>
        </motion.section>

        {/* Ďakujeme */}
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center border border-brand-red/40 bg-brand-red/10 rounded-sm p-16 flex flex-col items-center"
        >
          <Heart size={40} className="text-brand-red mx-auto mb-6" />
          <h2 className="text-5xl md:text-7xl font-black text-white uppercase mb-4">ĎAKUJEME</h2>
          <p className="text-gray-300 text-lg max-w-2xl mx-auto mb-10">
            Zo srdca vám ďakujeme, že ste sa rozhodli touto cestou nás podporiť.
            Nesmierne si ceníme vašej podpory.
          </p>
          <Link
            to="/kontakt"
            className="inline-flex items-center gap-2 bg-brand-red text-white text-xs font-black uppercase tracking-widest px-8 py-4 hover:bg-brand-red/80 transition-all"
          >
            Kontaktuj nás
          </Link>
        </motion.section>

      </div>
    </div>
  );
}
