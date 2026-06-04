import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { supabase } from '../supabase';
import { ChevronLeft, ChevronRight, Clock } from 'lucide-react';

const MONTHS = ['Január','Február','Marec','Apríl','Máj','Jún','Júl','August','September','Október','November','December'];
const DAYS = ['Po','Ut','St','Št','Pi','So','Ne'];

export default function Bookings() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [timeSlots, setTimeSlots] = useState<any[]>([]);
  const [trainers, setTrainers] = useState<any[]>([]);
  const [selectedSlot, setSelectedSlot] = useState<any | null>(null);
  const [step, setStep] = useState<'calendar' | 'form' | 'done'>('calendar');
  const [form, setForm] = useState({ name: '', email: '', phone: '' });
  const [loading, setLoading] = useState(false);

  useEffect(() => { fetchTrainers(); }, []);
  useEffect(() => { if (selectedDate) fetchTimeSlots(selectedDate); }, [selectedDate]);

  async function fetchTrainers() {
    const { data } = await supabase.from('trainers').select('*');
    if (data) setTrainers(data);
  }

  async function fetchTimeSlots(date: string) {
    const { data } = await supabase
      .from('time_slots')
      .select('*, trainers(*)')
      .eq('date', date)
      .eq('type', 'individual')
      .order('start_time');
    if (data) setTimeSlots(data);
  }

  async function handleBooking() {
    if (!selectedSlot) return;
    if (isTooSoon(selectedSlot)) return;
    setLoading(true);
    
    const { data: bookingData, error } = await supabase
      .from('bookings')
      .insert({
        time_slot_id: selectedSlot.id,
        trainer_id: selectedSlot.trainer_id,
        customer_name: form.name,
        customer_email: form.email,
        customer_phone: form.phone,
        status: 'confirmed'
      })
      .select()
      .single();

    if (!error && bookingData) {
      const newBookings = (selectedSlot.current_bookings || 0) + 1;
const isFull = newBookings >= selectedSlot.max_capacity;

await supabase.from('time_slots').update({ 
  current_bookings: newBookings,
  status: isFull ? 'booked' : 'available'
}).eq('id', selectedSlot.id);
      
      await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/send-booking-email`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
        },
        body: JSON.stringify({
          customer_name: form.name,
          customer_email: form.email,
          customer_phone: form.phone,
          trainer_name: selectedSlot.trainers?.name,
          date: selectedDate,
          start_time: selectedSlot.start_time.slice(0, 5),
          end_time: selectedSlot.end_time.slice(0, 5),
          booking_id: bookingData.id,
          slot_id: selectedSlot.id,
        }),
      });

      setStep('done');
    }
    setLoading(false);
  }

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const offset = firstDay === 0 ? 6 : firstDay - 1;
    return { daysInMonth, offset };
  };

  const { daysInMonth, offset } = getDaysInMonth(currentDate);

  const isTooSoon = (slot: any) => {
    const slotTime = new Date(`${slot.date}T${slot.start_time}`);
    return slotTime.getTime() - Date.now() < 24 * 60 * 60 * 1000;
  };

  const formatDate = (day: number) => {
    const y = currentDate.getFullYear();
    const m = String(currentDate.getMonth() + 1).padStart(2, '0');
    const d = String(day).padStart(2, '0');
    return `${y}-${m}-${d}`;
  };

  return (
    <div className="pt-32 pb-24 bg-brand-black min-h-screen">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <section className="mb-16">
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            className="text-5xl sm:text-7xl md:text-9xl mb-4 leading-none">
            REZERVÁCIE
          </motion.h1>
          <p className="text-brand-red text-xs uppercase tracking-[0.4em] font-black">
            VYBER SI TERMÍN A TRÉNERA
          </p>
        </section>

        {step === 'calendar' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-brand-gray border border-white/5 p-6 rounded-sm">
              <div className="flex items-center justify-between mb-6">
                <button onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1))}
                  className="text-white hover:text-brand-red transition-colors">
                  <ChevronLeft size={24} />
                </button>
                <h2 className="text-xl font-black text-white uppercase">
                  {MONTHS[currentDate.getMonth()]} {currentDate.getFullYear()}
                </h2>
                <button onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1))}
                  className="text-white hover:text-brand-red transition-colors">
                  <ChevronRight size={24} />
                </button>
              </div>

              <div className="grid grid-cols-7 mb-2">
                {DAYS.map(d => <div key={d} className="text-center text-xs text-gray-500 font-black py-2">{d}</div>)}
              </div>

              <div className="grid grid-cols-7 gap-1">
                {Array.from({ length: offset }).map((_, i) => <div key={`empty-${i}`} />)}
                {Array.from({ length: daysInMonth }).map((_, i) => {
                  const day = i + 1;
                  const dateStr = formatDate(day);
                  const today = new Date().toISOString().split('T')[0];
                  const isSelected = selectedDate === dateStr;
                  const isToday = dateStr === today;
                  const isPast = dateStr < today;
                  return (
                    <button key={day} onClick={() => !isPast && setSelectedDate(dateStr)}
                      disabled={isPast}
                      className={`aspect-square flex items-center justify-center text-sm font-black rounded-sm transition-all
                        ${isPast ? 'text-gray-700 cursor-not-allowed' : ''}
                        ${isSelected && !isPast ? 'bg-brand-red text-white' : ''}
                        ${isToday && !isSelected ? 'border border-brand-red text-brand-red' : ''}
                        ${!isSelected && !isToday && !isPast ? 'text-white hover:bg-white/10' : ''}
                      `}>
                      {day}
                    </button>
                  );
                })}
              </div>

              {trainers.length > 0 && (
                <div className="mt-6 pt-4 border-t border-white/5">
                  <p className="text-xs text-gray-500 uppercase tracking-widest mb-3">Tréneri:</p>
                  <div className="flex flex-wrap gap-4">
                    {trainers.map(t => (
                      <div key={t.id} className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: t.color }} />
                        <span className="text-xs text-white">{t.name}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="bg-brand-gray border border-white/5 p-6 rounded-sm">
              {!selectedDate ? (
                <div className="flex flex-col items-center justify-center h-full text-gray-500">
                  <Clock size={48} className="mb-4 opacity-30" />
                  <p className="text-sm uppercase tracking-widest">Klikni na deň v kalendári</p>
                </div>
              ) : timeSlots.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-gray-500">
                  <Clock size={48} className="mb-4 opacity-30" />
                  <p className="text-sm uppercase tracking-widest">Žiadne termíny</p>
                </div>
              ) : (
                <div className="space-y-3">
                  <h3 className="text-white font-black uppercase tracking-widest text-sm mb-4">
                    Dostupné termíny
                  </h3>
                  {timeSlots.map(slot => (
                    <button key={slot.id} onClick={() => { setSelectedSlot(slot); setStep('form'); }}
                      disabled={slot.status === 'booked' || isTooSoon(slot)}
                      className={`w-full p-4 border text-left transition-all rounded-sm
                        ${slot.status === 'booked' || isTooSoon(slot)
                          ? 'border-white/5 opacity-40 cursor-not-allowed bg-white/5'
                          : 'border-white/10 hover:border-brand-red cursor-pointer'}`}>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: slot.trainers?.color || '#cc0000' }} />
                          <div>
                            <p className="text-white font-black text-sm">{slot.start_time.slice(0,5)} – {slot.end_time.slice(0,5)}</p>
                            <p className="text-gray-500 text-xs">{slot.trainers?.name} • {
  slot.type === 'group' ? `👥 Skupinový` :
  slot.type === 'kids' ? `👶 Detský` :
  slot.type === 'junior' ? `🏅 Juniori` :
  slot.type === 'women' ? `♀ Ženy` :
  slot.type === 'men' ? `♂ Muži` :
  '🥊 Individuálny'
}
{(slot.type === 'group' || slot.type === 'kids' || slot.type === 'junior' || slot.type === 'women' || slot.type === 'men') && (
  <span className="ml-1 text-green-500 font-black">
    ({slot.max_capacity - (slot.current_bookings || 0)}/{slot.max_capacity} miest)
  </span>
)}</p>
                            {slot.location && (
                              <p className="text-brand-red text-xs font-black mt-0.5">📍 {slot.location}</p>
                            )}
                          </div>
                        </div>
                        <span className={`text-xs font-black uppercase tracking-widest
                          ${slot.status === 'booked' ? 'text-red-500' : isTooSoon(slot) ? 'text-yellow-600' : 'text-green-500'}`}>
                          {slot.status === 'booked' ? 'Obsadené' : isTooSoon(slot) ? 'Min. 24h vopred' : 'Voľné'}
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {step === 'form' && selectedSlot && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            className="max-w-lg mx-auto bg-brand-gray border border-white/5 p-5 sm:p-8 rounded-sm">
            <button onClick={() => setStep('calendar')} className="flex items-center text-gray-500 hover:text-white mb-6 transition-colors">
              <ChevronLeft size={20} className="mr-1" /> Späť
            </button>
            <h2 className="text-2xl font-black text-white uppercase mb-2">Dokončiť rezerváciu</h2>
            <div className="flex items-center gap-3 mb-6 p-4 bg-brand-black rounded-sm">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: selectedSlot.trainers?.color }} />
              <div>
                <p className="text-white font-black">{selectedSlot.start_time.slice(0,5)} – {selectedSlot.end_time.slice(0,5)}</p>
                <p className="text-gray-500 text-xs">{selectedSlot.trainers?.name} • {selectedDate}</p>
                {selectedSlot.location && (
                  <p className="text-brand-red text-xs font-black mt-0.5">📍 {selectedSlot.location}</p>
                )}
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <label className="text-xs uppercase tracking-widest text-gray-400 mb-2 block">Meno a priezvisko</label>
                <input type="text" value={form.name} onChange={e => setForm({...form, name: e.target.value})}
                  className="w-full bg-brand-black border border-white/10 py-3 px-4 text-white focus:border-brand-red outline-none rounded-sm" />
              </div>
              <div>
                <label className="text-xs uppercase tracking-widest text-gray-400 mb-2 block">Email</label>
                <input type="email" value={form.email} onChange={e => setForm({...form, email: e.target.value})}
                  className="w-full bg-brand-black border border-white/10 py-3 px-4 text-white focus:border-brand-red outline-none rounded-sm" />
              </div>
              <div>
                <label className="text-xs uppercase tracking-widest text-gray-400 mb-2 block">Telefón</label>
                <input type="tel" value={form.phone} onChange={e => setForm({...form, phone: e.target.value})}
                  className="w-full bg-brand-black border border-white/10 py-3 px-4 text-white focus:border-brand-red outline-none rounded-sm" />
              </div>
              <button onClick={handleBooking} disabled={loading || !form.name || !form.email}
                className="btn-primary w-full text-center mt-4">
                {loading ? 'Rezervujem...' : 'Potvrdiť rezerváciu'}
              </button>
            </div>
          </motion.div>
        )}

        {step === 'done' && (
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
            className="max-w-lg mx-auto text-center py-16">
            <div className="text-6xl mb-6">🥊</div>
            <h2 className="text-4xl font-black text-white uppercase mb-4">Rezervácia potvrdená!</h2>
            <p className="text-gray-500 mb-8">Potvrdenie ti príde na email.</p>
            <button onClick={() => { setStep('calendar'); setSelectedSlot(null); setForm({ name: '', email: '', phone: '' }); }}
              className="btn-primary">
              Nová rezervácia
            </button>
          </motion.div>
        )}
      </div>
    </div>
  );
}