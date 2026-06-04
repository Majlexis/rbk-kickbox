import { useState } from 'react';
import { ChevronLeft, ChevronRight, Trash2 } from 'lucide-react';

const MONTHS = ['Január','Február','Marec','Apríl','Máj','Jún','Júl','August','September','Október','November','December'];
const DAYS = ['Po','Ut','St','Št','Pi','So','Ne'];

export default function AdminCalendar({ bookings, slots, onDeleteBooking, onCancelBooking }: { bookings: any[], slots: any[], onDeleteBooking?: (id: string) => void, onCancelBooking?: (id: string) => void }) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const offset = firstDay === 0 ? 6 : firstDay - 1;
    return { daysInMonth, offset };
  };

  const { daysInMonth, offset } = getDaysInMonth(currentDate);

  const formatDate = (day: number) => {
    const y = currentDate.getFullYear();
    const m = String(currentDate.getMonth() + 1).padStart(2, '0');
    const d = String(day).padStart(2, '0');
    return `${y}-${m}-${d}`;
  };

  const getBookingsForDate = (dateStr: string) => {
    return bookings.filter(b => b.time_slots?.date === dateStr);
  };

  const getSlotsForDate = (dateStr: string) => {
    return slots.filter(s => s.date === dateStr);
  };

  const selectedBookings = selectedDate ? getBookingsForDate(selectedDate) : [];
  const selectedSlots = selectedDate ? getSlotsForDate(selectedDate) : [];

  return (
    <div className="flex flex-col gap-8">
      {/* Kalendár */}
      <div className="bg-brand-gray border border-white/5 p-10 rounded-sm">
        <div className="flex items-center justify-between mb-10">
          <button onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1))}
            className="text-white hover:text-brand-red transition-colors">
            <ChevronLeft size={40} />
          </button>
          <h2 className="text-3xl font-black text-white uppercase tracking-widest">
            {MONTHS[currentDate.getMonth()]} {currentDate.getFullYear()}
          </h2>
          <button onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1))}
            className="text-white hover:text-brand-red transition-colors">
            <ChevronRight size={40} />
          </button>
        </div>

        <div className="grid grid-cols-7 mb-3">
          {DAYS.map(d => <div key={d} className="text-center text-base text-gray-500 font-black py-4">{d}</div>)}
        </div>

        <div className="grid grid-cols-7 gap-2">
          {Array.from({ length: offset }).map((_, i) => <div key={`empty-${i}`} />)}
          {Array.from({ length: daysInMonth }).map((_, i) => {
            const day = i + 1;
            const dateStr = formatDate(day);
            const isSelected = selectedDate === dateStr;
            const isToday = dateStr === new Date().toISOString().split('T')[0];
            const dayBookings = getBookingsForDate(dateStr);
            const daySlots = getSlotsForDate(dateStr);

            return (
              <button key={day} onClick={() => setSelectedDate(dateStr)}
                className={`min-h-[90px] flex flex-col items-center justify-center text-xl font-black rounded-sm transition-all
                  ${isSelected ? 'bg-brand-red text-white' : ''}
                  ${isToday && !isSelected ? 'border-2 border-brand-red text-brand-red' : ''}
                  ${!isSelected && !isToday ? 'text-white hover:bg-white/10' : ''}
                `}>
                <span>{day}</span>
                {daySlots.length > 0 && (
                  <div className="flex gap-1 mt-1.5">
                    {dayBookings.length > 0 && (
                      <span className={`text-[10px] font-black px-1.5 py-0.5 rounded-full ${isSelected ? 'bg-white text-brand-red' : 'bg-brand-red text-white'}`}>
                        {dayBookings.length}
                      </span>
                    )}
                    <span className={`text-[10px] font-black px-1.5 py-0.5 rounded-full ${isSelected ? 'bg-white/30 text-white' : 'bg-white/20 text-white'}`}>
                      {daySlots.length}
                    </span>
                  </div>
                )}
              </button>
            );
          })}
        </div>

        <div className="mt-8 pt-8 border-t border-white/5 flex gap-8">
          <div className="flex items-center gap-3">
            <span className="bg-brand-red text-white text-xs font-black px-2 py-0.5 rounded-full">2</span>
            <span className="text-base text-gray-400">Rezervácie</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="bg-white/20 text-white text-xs font-black px-2 py-0.5 rounded-full">5</span>
            <span className="text-base text-gray-400">Termíny</span>
          </div>
        </div>
      </div>

      {/* Detail dňa */}
      <div className="bg-brand-gray border border-white/5 p-10 rounded-sm">
        {!selectedDate ? (
          <div className="flex flex-col items-center justify-center py-16 text-gray-500">
            <p className="text-base uppercase tracking-widest">Klikni na deň v kalendári</p>
          </div>
        ) : (
          <div>
            <h3 className="text-2xl font-black text-white uppercase mb-4">{selectedDate}</h3>
            <div className="flex gap-6 mb-8">
              <div className="bg-brand-red/20 border border-brand-red/30 px-6 py-4 rounded-sm">
                <p className="text-brand-red font-black text-4xl">{selectedBookings.length}</p>
                <p className="text-sm text-gray-400 uppercase tracking-widest mt-1">Rezervácií</p>
              </div>
              <div className="bg-white/5 border border-white/10 px-6 py-4 rounded-sm">
                <p className="text-white font-black text-4xl">{selectedSlots.length}</p>
                <p className="text-sm text-gray-400 uppercase tracking-widest mt-1">Termínov</p>
              </div>
            </div>

            <h4 className="text-sm uppercase tracking-widest text-gray-400 mb-4">Rezervácie:</h4>
            <div className="space-y-3 mb-8">
              {selectedBookings.length === 0 && <p className="text-gray-500 text-base">Žiadne rezervácie</p>}
              {selectedBookings.map(b => (
                <div key={b.id} className={`p-4 bg-brand-black rounded-sm border ${b.status === 'cancelled' ? 'border-white/10 opacity-50' : 'border-brand-red/30'}`}>
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="flex items-center gap-2 mb-0.5">
                        <p className="text-white font-black text-base">{b.customer_name}</p>
                        {b.status === 'cancelled' && (
                          <span className="text-xs font-black uppercase tracking-widest text-gray-500 border border-white/10 px-2 py-0.5">Zrušená</span>
                        )}
                      </div>
                      <p className="text-gray-400 text-sm">{b.customer_email}</p>
                      {b.customer_phone && <p className="text-gray-500 text-sm">📞 {b.customer_phone}</p>}
                    </div>
                    <div className="flex items-center gap-3">
                      <p className="text-brand-red font-black text-base">
                        {b.time_slots?.start_time?.slice(0,5)} – {b.time_slots?.end_time?.slice(0,5)}
                      </p>
                      {onCancelBooking && b.status !== 'cancelled' && (
                        <button onClick={() => onCancelBooking(b.id)}
                          title="Zrušiť rezerváciu"
                          className="text-yellow-600 hover:text-yellow-400 transition-colors text-xs font-black uppercase tracking-widest border border-yellow-600/40 hover:border-yellow-400 px-2 py-1">
                          Zrušiť
                        </button>
                      )}
                      {onDeleteBooking && (
                        <button onClick={() => onDeleteBooking(b.id)}
                          title="Vymazať"
                          className="text-gray-500 hover:text-red-500 transition-colors">
                          <Trash2 size={18} />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <h4 className="text-sm uppercase tracking-widest text-gray-400 mb-4">Všetky termíny:</h4>
            <div className="space-y-3">
              {selectedSlots.map(s => (
                <div key={s.id} className={`p-4 border rounded-sm flex justify-between items-center
                  ${s.status === 'booked' ? 'border-red-500/30 bg-red-500/5' : 'border-white/5 bg-white/5'}`}>
                  <p className="text-white text-base font-black">{s.start_time.slice(0,5)} – {s.end_time.slice(0,5)}</p>
                  <span className={`text-sm font-black uppercase ${s.status === 'booked' ? 'text-red-500' : 'text-green-500'}`}>
                    {s.status === 'booked' ? 'Obsadené' : 'Voľné'}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}