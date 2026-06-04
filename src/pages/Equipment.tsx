import { motion } from 'motion/react';
import { X } from 'lucide-react';
import { useState } from 'react';
import { EQUIPMENT_IMAGES } from '../constants';

export default function Equipment() {
  const [selectedImg, setSelectedImg] = useState<{ url: string; caption: string } | null>(null);

  return (
    <div className="pt-32 pb-24 bg-brand-black min-h-screen">

      {/* Lightbox */}
      {selectedImg && (
        <div
          className="fixed inset-0 bg-black/90 z-50 flex flex-col items-center justify-center p-4"
          onClick={() => setSelectedImg(null)}
        >
          <button
            className="absolute top-6 right-6 text-white hover:text-brand-red transition-colors"
            onClick={() => setSelectedImg(null)}
          >
            <X size={40} />
          </button>
          <img
            src={selectedImg.url}
            alt={selectedImg.caption}
            className="max-w-full max-h-[80vh] object-contain"
            onClick={(e) => e.stopPropagation()}
          />
          <p className="mt-4 text-white text-sm uppercase tracking-widest font-black">
            {selectedImg.caption}
          </p>
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
            VYBAVENIE
          </motion.h1>
          <p className="max-w-2xl text-brand-red text-xs uppercase tracking-[0.4em] font-black">
            PROFESIONÁLNE VYBAVENIE NAŠEJ POSILŇOVNE
          </p>
        </section>

        {/* Photo Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {EQUIPMENT_IMAGES.map((img, index) => (
            <motion.div
              key={img.id}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: (index % 3) * 0.1 }}
              className="group cursor-pointer"
              onClick={() => setSelectedImg({ url: img.url, caption: img.caption })}
            >
              <div className="relative aspect-[4/5] overflow-hidden bg-brand-gray border border-white/5">
                <img
                  src={img.url}
                  alt={img.caption}
                  className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700"
                />
                <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center">
                  <span className="text-white text-sm uppercase tracking-widest font-black">Zobraziť</span>
                </div>
              </div>
              <p className="mt-3 text-white text-sm uppercase tracking-widest font-black border-l-2 border-brand-red pl-3">
                {img.caption}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
