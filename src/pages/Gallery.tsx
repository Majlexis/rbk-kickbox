import { motion } from 'motion/react';
import { Play, X, ChevronRight } from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { GALLERY_IMAGES } from '../constants';

export default function Gallery() {
  const [selectedImg, setSelectedImg] = useState<string | null>(null);

  const videos = [
    { id: 'v1', title: 'Zápasová príprava', embedId: '2-O5IqK0b5Y' },
    { id: 'v2', title: 'Technika úderov a kopov', embedId: 'lB6O7sIdzM4' },
  ];

  return (
    <div className="pt-32 pb-24 bg-brand-black min-h-screen">

      {/* Lightbox */}
      {selectedImg && (
        <div
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedImg(null)}
        >
          <button
            className="absolute top-6 right-6 text-white hover:text-brand-red transition-colors"
            onClick={() => setSelectedImg(null)}
          >
            <X size={40} />
          </button>
          <img
            src={selectedImg}
            alt="Zväčšená fotka"
            className="max-w-full max-h-[90vh] object-contain"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <section className="mb-20">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl sm:text-7xl md:text-9xl mb-4 leading-none"
          >
            GALÉRIA
          </motion.h1>
          <p className="max-w-2xl text-brand-red text-xs uppercase tracking-[0.4em] font-black">
            AUTENTICKÉ ZÁBERY Z TRÉNINGOV A ZÁPASOV
          </p>
          <Link
            to="/vybavenie"
            className="inline-flex items-center gap-1 mt-6 text-xs font-black uppercase tracking-widest text-gray-400 hover:text-brand-red transition-colors group"
          >
            Pozri aj naše vybavenie
            <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </section>

        {/* Photo Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-24">
          {GALLERY_IMAGES.map((img, index) => (
            <motion.div
              key={img.id}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: (index % 3) * 0.1 }}
              className="group relative aspect-[4/5] overflow-hidden bg-brand-gray border border-white/5 cursor-pointer"
              onClick={() => setSelectedImg(img.url)}
            >
              <img
                src={img.url}
                className="w-full h-full object-cover group-hover:scale-105 transition-all duration-700"
              />
              <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center">
                <span className="text-white text-sm uppercase tracking-widest font-black">Zobraziť</span>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Video Section */}
        
        {/* <section>
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-6xl mb-4">VIDEÁ</h2>
            <div className="w-16 h-1 bg-brand-red mx-auto" />
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {videos.map((vid) => (
              <motion.div
                key={vid.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="group"
              >
                <div className="aspect-video relative overflow-hidden bg-brand-gray rounded-sm mb-4">
                  <iframe
                    className="absolute inset-0 w-full h-full"
                    src={`https://www.youtube.com/embed/${vid.embedId}`}
                    title={vid.title}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
                <h3 className="font-display text-2xl text-white tracking-wider flex items-center">
                  <Play className="mr-2 text-brand-red" size={20} fill="#cc0000" />
                  {vid.title}
                </h3>
              </motion.div>
            ))}
          </div>
        </section>
*/}
        
      </div>
    </div>
  );
}