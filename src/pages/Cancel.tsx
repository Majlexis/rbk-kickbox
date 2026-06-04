import { useState } from 'react';
import { motion } from 'motion/react';
import { Link, useSearchParams } from 'react-router-dom';
import { XCircle, CheckCircle, AlertTriangle } from 'lucide-react';

export default function Cancel() {
  const [searchParams] = useSearchParams();
  const bookingId = searchParams.get('booking_id');
  const slotId = searchParams.get('slot_id');
  const [step, setStep] = useState<'confirm' | 'done' | 'error'>(bookingId && slotId ? 'confirm' : 'done');
  const [loading, setLoading] = useState(false);

  async function handleCancel() {
    setLoading(true);
    try {
      const res = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/cancel-booking?booking_id=${bookingId}&slot_id=${slotId}`,
        { method: 'GET' }
      );
      if (res.ok || res.redirected) {
        setStep('done');
      } else {
        setStep('error');
      }
    } catch {
      setStep('error');
    }
    setLoading(false);
  }

  return (
    <div className="pt-32 pb-24 bg-brand-black min-h-screen flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-lg mx-auto text-center px-4"
      >
        {step === 'confirm' && (
          <>
            <AlertTriangle size={80} className="text-yellow-500 mx-auto mb-6" />
            <h1 className="text-5xl font-black text-white uppercase mb-4">
              Zrušiť rezerváciu?
            </h1>
            <p className="text-gray-400 text-lg mb-10">
              Naozaj chceš zrušiť svoju rezerváciu? Táto akcia sa nedá vrátiť.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={handleCancel}
                disabled={loading}
                className="btn-primary bg-brand-red hover:bg-red-700"
              >
                {loading ? 'Ruším...' : 'Áno, zrušiť rezerváciu'}
              </button>
              <Link to="/rezervacie" className="btn-primary bg-brand-gray border border-white/20 hover:border-white/50">
                Nie, ponechať
              </Link>
            </div>
          </>
        )}

        {step === 'done' && (
          <>
            <XCircle size={80} className="text-brand-red mx-auto mb-6" />
            <h1 className="text-5xl font-black text-white uppercase mb-4">
              Rezervácia zrušená
            </h1>
            <p className="text-gray-400 text-lg mb-8">
              Vaša rezervácia bola úspešne zrušená. Termín je opäť voľný.
            </p>
            <Link to="/rezervacie" className="btn-primary">
              Rezervovať nový termín
            </Link>
          </>
        )}

        {step === 'error' && (
          <>
            <CheckCircle size={80} className="text-gray-500 mx-auto mb-6" />
            <h1 className="text-5xl font-black text-white uppercase mb-4">
              Nastala chyba
            </h1>
            <p className="text-gray-400 text-lg mb-8">
              Nepodarilo sa zrušiť rezerváciu. Skús to znova alebo nás kontaktuj.
            </p>
            <Link to="/kontakt" className="btn-primary">
              Kontaktovať nás
            </Link>
          </>
        )}
      </motion.div>
    </div>
  );
}
