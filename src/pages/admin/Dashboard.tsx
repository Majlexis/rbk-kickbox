import { useState, useEffect } from 'react';
import { supabase } from '../../supabase';
import { useNavigate } from 'react-router-dom';
import { Plus, Trash2, LogOut, Calendar, Users, Download, Search } from 'lucide-react';
import AdminCalendar from '../../components/AdminCalendar';

const DAYS = ['Po', 'Ut', 'St', 'Št', 'Pi', 'So', 'Ne'];

export default function Dashboard() {
  const [slots, setSlots] = useState<any[]>([]);
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'slots' | 'bookings'>('slots');
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const [bookingFilter, setBookingFilter] = useState('');
  const navigate = useNavigate();

  function showToast(message: string, type: 'success' | 'error' = 'success') {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  }

  // Jednoduché pridanie
const [newSlot, setNewSlot] = useState({ date: '', start_time: '', end_time: '', type: 'individual', max_capacity: 1, location: '' });
  const [bulk, setBulk] = useState({
    from: '',
    to: '',
    days: [] as number[],
    times: [{ start: '', end: '', type: 'individual', max_capacity: 1 }],
    location: ''
  });

  useEffect(() => {
    checkAuth();
    fetchSlots();
    fetchBookings();

    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }

    const channel = supabase
      .channel('new-bookings')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'bookings' }, (payload) => {
        fetchBookings();
        if ('Notification' in window && Notification.permission === 'granted') {
          new Notification('RBK Kickbox — Nová rezervácia!', {
            body: `${payload.new.customer_name} (${payload.new.customer_email})`,
            icon: '/images/hero.jpg',
          });
        }
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, []);

  async function checkAuth() {
    const { data } = await supabase.auth.getSession();
    if (!data.session) navigate('/admin/login');
  }

  async function fetchSlots() {
    const { data } = await supabase
      .from('time_slots')
      .select('*')
      .order('date', { ascending: true })
      .order('start_time', { ascending: true });
    if (data) setSlots(data);
  }

  async function fetchBookings() {
    const { data } = await supabase
      .from('bookings')
      .select('*, time_slots(*)')
      .eq('status', 'confirmed')
      .order('created_at', { ascending: false });
    if (data) setBookings(data);
  }

  async function addSlot() {
    if (!newSlot.date || !newSlot.start_time || !newSlot.end_time) return;
    setLoading(true);
    const { data: trainer } = await supabase.from('trainers').select('*').single();
    await supabase.from('time_slots').insert({
      trainer_id: trainer.id,
      date: newSlot.date,
      start_time: newSlot.start_time,
      end_time: newSlot.end_time,
      status: 'available',
      type: newSlot.type,
      max_capacity: newSlot.max_capacity,
      location: newSlot.location
    });
    setNewSlot({ date: '', start_time: '', end_time: '', type: 'individual', max_capacity: 1, location: '' });
    fetchSlots();
    setLoading(false);
    showToast('Termín bol pridaný.');
  }

  async function addBulkSlots() {
    if (!bulk.from || !bulk.to || bulk.days.length === 0) return;
    if (bulk.times.some(t => !t.start || !t.end)) return;
    setLoading(true);

    const { data: trainer } = await supabase.from('trainers').select('*').single();
    const slotsToInsert: any[] = [];

    const current = new Date(bulk.from);
    const end = new Date(bulk.to);

    while (current <= end) {
      const dayOfWeek = current.getDay();
      const adjustedDay = dayOfWeek === 0 ? 6 : dayOfWeek - 1;

      if (bulk.days.includes(adjustedDay)) {
        for (const time of bulk.times) {
          slotsToInsert.push({
            trainer_id: trainer.id,
            date: current.toISOString().split('T')[0],
            start_time: time.start,
            end_time: time.end,
            status: 'available',
            type: time.type,
            max_capacity: time.type === 'individual' ? 1 : time.max_capacity,
            location: bulk.location
          });
        }
      }
      current.setDate(current.getDate() + 1);
    }

    await supabase.from('time_slots').insert(slotsToInsert);
    setBulk({ from: '', to: '', days: [], times: [{ start: '', end: '', type: 'individual', max_capacity: 1 }], location: '' });
    fetchSlots();
    setLoading(false);
    showToast(`Vytvorených ${slotsToInsert.length} termínov.`);
  }

  async function cancelBooking(id: string) {
    const { error } = await supabase.from('bookings').update({ status: 'cancelled' }).eq('id', id);
    if (error) { showToast('Chyba: ' + error.message, 'error'); return; }
    fetchBookings();
    showToast('Rezervácia bola označená ako zrušená.');
  }

  async function deleteBooking(id: string) {
    const { error, count } = await supabase.from('bookings').delete({ count: 'exact' }).eq('id', id);
    console.log('deleteBooking result:', { error, count, id });
    if (error) {
      showToast('Chyba: ' + error.message, 'error');
      return;
    }
    if (count === 0) {
      showToast('Zmazanie zlyhalo – skontroluj RLS policy v Supabase.', 'error');
      return;
    }
    fetchBookings();
    fetchSlots();
    showToast('Rezervácia bola zmazaná.');
  }

  async function deleteSlot(id: string) {
    await supabase.from('bookings').delete().eq('time_slot_id', id);
    const { error } = await supabase.from('time_slots').delete().eq('id', id);
    if (error) {
      showToast('Chyba: ' + error.message, 'error');
      return;
    }
    fetchSlots();
    fetchBookings();
    showToast('Termín bol zmazaný.');
  }

  async function logout() {
    await supabase.auth.signOut();
    navigate('/admin/login');
  }

  function exportBookingsCSV() {
    const header = 'Meno,Email,Telefón,Dátum,Čas od,Čas do,Stav';
    const rows = bookings.map(b =>
      [
        b.customer_name,
        b.customer_email,
        b.customer_phone || '',
        b.time_slots?.date || '',
        b.time_slots?.start_time?.slice(0, 5) || '',
        b.time_slots?.end_time?.slice(0, 5) || '',
        b.status,
      ].map(v => '"' + String(v).replace(/"/g, '""') + '"').join(',')
    );
    const csv = [header, ...rows].join('\n');
    const blob = new Blob(['﻿' + csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'rezervacie-' + new Date().toISOString().split('T')[0] + '.csv';
    a.click();
    URL.revokeObjectURL(url);
  }

  const toggleDay = (day: number) => {
    setBulk(prev => ({
      ...prev,
      days: prev.days.includes(day) ? prev.days.filter(d => d !== day) : [...prev.days, day]
    }));
  };

  const updateTime = (index: number, field: 'start' | 'end' | 'type' | 'max_capacity', value: string | number) => {
    const newTimes = bulk.times.map((t, i) => i === index ? { ...t, [field]: value } : t);
    setBulk(prev => ({ ...prev, times: newTimes }));
  };

  const addTime = () => setBulk(prev => ({ ...prev, times: [...prev.times, { start: '', end: '', type: 'individual', max_capacity: 1 }] }));
  const removeTime = (index: number) => setBulk(prev => ({ ...prev, times: prev.times.filter((_, i) => i !== index) }));

  const prefillPoStPi = () => {
    setBulk(prev => ({
      ...prev,
      days: [0, 2, 4],
      times: [
        { start: '17:00', end: '18:00', type: 'kids', max_capacity: 20 },
        { start: '18:00', end: '19:30', type: 'junior', max_capacity: 20 },
      ],
      location: 'ZŠ Labrocká'
    }));
  };

  const prefillUtSt = () => {
    setBulk(prev => ({
      ...prev,
      days: [1, 3],
      times: [
        { start: '18:00', end: '19:00', type: 'women', max_capacity: 20 },
        { start: '19:30', end: '20:30', type: 'men', max_capacity: 20 },
      ],
      location: 'Námestie slobody 69 (vstup cez firmu Montter cez bránu)'
    }));
  };

  const today = new Date().toISOString().split('T')[0];
  const thisMonth = today.slice(0, 7);
  const bookingsThisMonth = bookings.filter(b => b.time_slots?.date?.startsWith(thisMonth)).length;
  const upcomingSlots = slots.filter(s => s.date >= today);
  const freeUpcoming = upcomingSlots.filter(s => s.status === 'available').length;

  return (
    <div className="min-h-screen bg-brand-black">
      <div className="bg-brand-gray border-b border-white/5 px-6 py-4 flex justify-between items-center">
        <h1 className="text-2xl font-black text-white uppercase">Admin Panel</h1>
        <button onClick={logout} className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors">
          <LogOut size={20} /> Odhlásiť
        </button>
      </div>

      {/* Štatistiky */}
      <div className="max-w-5xl mx-auto px-4 pt-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-brand-gray border border-white/5 p-5 rounded-sm">
            <p className="text-gray-500 text-xs uppercase tracking-widest mb-1">Celkom rezervácií</p>
            <p className="text-white font-black text-3xl">{bookings.length}</p>
          </div>
          <div className="bg-brand-gray border border-white/5 p-5 rounded-sm">
            <p className="text-gray-500 text-xs uppercase tracking-widest mb-1">Tento mesiac</p>
            <p className="text-brand-red font-black text-3xl">{bookingsThisMonth}</p>
          </div>
          <div className="bg-brand-gray border border-white/5 p-5 rounded-sm">
            <p className="text-gray-500 text-xs uppercase tracking-widest mb-1">Nadchádzajúce termíny</p>
            <p className="text-white font-black text-3xl">{upcomingSlots.length}</p>
          </div>
          <div className="bg-brand-gray border border-white/5 p-5 rounded-sm">
            <p className="text-gray-500 text-xs uppercase tracking-widest mb-1">Voľné termíny</p>
            <p className="text-green-500 font-black text-3xl">{freeUpcoming}</p>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 pb-8">
        <div className="flex gap-4 mb-8">
          <button onClick={() => setActiveTab('slots')}
            className={`flex items-center gap-2 px-6 py-3 font-black uppercase text-sm tracking-widest transition-all
              ${activeTab === 'slots' ? 'bg-brand-red text-white' : 'bg-brand-gray text-gray-400 hover:text-white'}`}>
            <Calendar size={18} /> Termíny
          </button>
          <button onClick={() => setActiveTab('bookings')}
            className={`flex items-center gap-2 px-6 py-3 font-black uppercase text-sm tracking-widest transition-all
              ${activeTab === 'bookings' ? 'bg-brand-red text-white' : 'bg-brand-gray text-gray-400 hover:text-white'}`}>
            <Users size={18} /> Rezervácie ({bookings.length})
          </button>
        </div>

        {activeTab === 'slots' && (
          <div className="space-y-6">

            {/* Hromadné pridanie */}
            <div className="bg-brand-gray border border-brand-red/30 p-6 rounded-sm">
              <h2 className="text-lg font-black text-white uppercase mb-4">🔥 Hromadné pridanie termínov</h2>
              
              {/* Od - Do */}
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="text-xs uppercase tracking-widest text-gray-400 mb-2 block">Od</label>
                  <input type="date" value={bulk.from} onChange={e => setBulk({...bulk, from: e.target.value})}
                    style={{ colorScheme: 'dark' }}
                    className="w-full bg-brand-black border border-white/10 py-3 px-4 text-white focus:border-brand-red outline-none rounded-sm cursor-pointer" />
                </div>
                <div>
                  <label className="text-xs uppercase tracking-widest text-gray-400 mb-2 block">Do</label>
                  <input type="date" value={bulk.to} onChange={e => setBulk({...bulk, to: e.target.value})}
                    style={{ colorScheme: 'dark' }}
                    className="w-full bg-brand-black border border-white/10 py-3 px-4 text-white focus:border-brand-red outline-none rounded-sm cursor-pointer" />
                </div>
              </div>

              {/* Dni v týždni */}
              <div className="mb-4">
                <label className="text-xs uppercase tracking-widest text-gray-400 mb-2 block">Dni v týždni</label>
                <div className="flex gap-2 flex-wrap">
                  {DAYS.map((day, index) => (
                    <button key={index} onClick={() => toggleDay(index)}
                      className={`px-4 py-2 font-black text-sm uppercase transition-all rounded-sm
                        ${bulk.days.includes(index) ? 'bg-brand-red text-white' : 'bg-brand-black text-gray-400 hover:text-white border border-white/10'}`}>
                      {day}
                    </button>
                  ))}
                </div>
              </div>

              {/* Časy */}
              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
  <label className="text-xs uppercase tracking-widest text-gray-400">Časy tréningov</label>
  <div className="flex gap-3">
    <button onClick={prefillPoStPi} className="text-brand-red text-xs font-black uppercase tracking-widest hover:text-white transition-colors">
      ⚡ PO/ST/PI
    </button>
    <button onClick={prefillUtSt} className="text-brand-red text-xs font-black uppercase tracking-widest hover:text-white transition-colors">
      ⚡ UT/ŠT
    </button>
  </div>
</div>
                <div className="space-y-3">
                  {bulk.times.map((time, index) => (
                    <div key={index} className="bg-brand-black border border-white/10 rounded-sm p-3 space-y-2">
                      <div className="flex gap-2 items-center">
                        <input type="time" value={time.start} onChange={e => updateTime(index, 'start', e.target.value)}
                          style={{ colorScheme: 'dark' }}
                          className="bg-brand-gray border border-white/10 py-2 px-3 text-white focus:border-brand-red outline-none rounded-sm cursor-pointer" />
                        <span className="text-gray-400">–</span>
                        <input type="time" value={time.end} onChange={e => updateTime(index, 'end', e.target.value)}
                          style={{ colorScheme: 'dark' }}
                          className="bg-brand-gray border border-white/10 py-2 px-3 text-white focus:border-brand-red outline-none rounded-sm cursor-pointer" />
                        {bulk.times.length > 1 && (
                          <button onClick={() => removeTime(index)} className="ml-auto text-gray-500 hover:text-red-500 transition-colors">
                            <Trash2 size={16} />
                          </button>
                        )}
                      </div>
                      <div className="flex gap-2">
                        <select value={time.type} onChange={e => updateTime(index, 'type', e.target.value)}
                          className="flex-1 bg-brand-gray border border-white/10 py-2 px-3 text-white focus:border-brand-red outline-none rounded-sm cursor-pointer text-sm">
                          <option value="individual">🥊 Individuálny</option>
                          <option value="group">👥 Skupinový</option>
                          <option value="kids">👶 Detský</option>
                          <option value="junior">🏅 Juniori</option>
                          <option value="women">♀ Ženy</option>
                          <option value="men">♂ Muži</option>
                        </select>
                        <input type="number" min={1} max={50} value={time.max_capacity}
                          onChange={e => updateTime(index, 'max_capacity', parseInt(e.target.value))}
                          disabled={time.type === 'individual'}
                          placeholder="Kapacita"
                          className="w-28 bg-brand-gray border border-white/10 py-2 px-3 text-white focus:border-brand-red outline-none rounded-sm disabled:opacity-40 text-sm" />
                      </div>
                    </div>
                  ))}
                  <button onClick={addTime} className="text-brand-red text-sm font-black uppercase tracking-widest hover:text-white transition-colors flex items-center gap-1">
                    <Plus size={16} /> Pridať čas
                  </button>
                </div>
              </div>
              {/* Lokalita */}
              <div className="mb-4">
                <label className="text-xs uppercase tracking-widest text-gray-400 mb-2 block">Lokalita</label>
                <input type="text" value={bulk.location} onChange={e => setBulk({...bulk, location: e.target.value})}
                  placeholder="napr. ZŠ Labrocká"
                  className="w-full bg-brand-black border border-white/10 py-3 px-4 text-white focus:border-brand-red outline-none rounded-sm" />
              </div>

              <button onClick={addBulkSlots} disabled={loading}
                className="btn-primary flex items-center gap-2">
                <Plus size={20} /> {loading ? 'Generujem...' : 'Vygenerovať termíny'}
              </button>
            </div>

            {/* Jednoduché pridanie */}
            <div className="bg-brand-gray border border-white/5 p-6 rounded-sm">
              <h2 className="text-lg font-black text-white uppercase mb-4">Pridať jeden termín</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div>
                  <label className="text-xs uppercase tracking-widest text-gray-400 mb-2 block">Dátum</label>
                  <input type="date" value={newSlot.date} onChange={e => setNewSlot({...newSlot, date: e.target.value})}
                    style={{ colorScheme: 'dark' }}
                    className="w-full bg-brand-black border border-white/10 py-3 px-4 text-white focus:border-brand-red outline-none rounded-sm cursor-pointer" />
                </div>
                <div>
                  <label className="text-xs uppercase tracking-widest text-gray-400 mb-2 block">Začiatok</label>
                  <input type="time" value={newSlot.start_time} onChange={e => setNewSlot({...newSlot, start_time: e.target.value})}
                    style={{ colorScheme: 'dark' }}
                    className="w-full bg-brand-black border border-white/10 py-3 px-4 text-white focus:border-brand-red outline-none rounded-sm cursor-pointer" />
                </div>
                <div>
                  <label className="text-xs uppercase tracking-widest text-gray-400 mb-2 block">Koniec</label>
                  <input type="time" value={newSlot.end_time} onChange={e => setNewSlot({...newSlot, end_time: e.target.value})}
                    style={{ colorScheme: 'dark' }}
                    className="w-full bg-brand-black border border-white/10 py-3 px-4 text-white focus:border-brand-red outline-none rounded-sm cursor-pointer" />
                </div>
              </div>
              {/* Lokalita */}
              <div className="mb-4">
                <label className="text-xs uppercase tracking-widest text-gray-400 mb-2 block">Lokalita</label>
                <input type="text" value={newSlot.location} onChange={e => setNewSlot({...newSlot, location: e.target.value})}
                  placeholder="napr. ZŠ Labrocká"
                  className="w-full bg-brand-black border border-white/10 py-3 px-4 text-white focus:border-brand-red outline-none rounded-sm" />
              </div>

              {/* Typ tréningu a kapacita */}
<div className="grid grid-cols-2 gap-4 mb-4">
  <div>
    <label className="text-xs uppercase tracking-widest text-gray-400 mb-2 block">Typ tréningu</label>
    <select value={newSlot.type} onChange={e => setNewSlot({...newSlot, type: e.target.value, max_capacity: e.target.value === 'individual' ? 1 : 10})}
      className="w-full bg-brand-black border border-white/10 py-3 px-4 text-white focus:border-brand-red outline-none rounded-sm cursor-pointer">
      <option value="individual">🥊 Individuálny</option>
      <option value="group">👥 Skupinový</option>
      <option value="kids">👶 Detský</option>
      <option value="junior">🏅 Juniori</option>
    </select>
  </div>
  <div>
    <label className="text-xs uppercase tracking-widest text-gray-400 mb-2 block">Max. kapacita</label>
    <input type="number" min={1} max={50} value={newSlot.max_capacity}
      onChange={e => setNewSlot({...newSlot, max_capacity: parseInt(e.target.value)})}
      disabled={newSlot.type === 'individual'}
      className="w-full bg-brand-black border border-white/10 py-3 px-4 text-white focus:border-brand-red outline-none rounded-sm disabled:opacity-40" />
  </div>
</div>
              <button onClick={addSlot} disabled={loading}
                className="btn-primary flex items-center gap-2">
                <Plus size={20} /> Pridať termín
              </button>
            </div>

            {/* Zoznam termínov */}
            <div className="bg-brand-gray border border-white/5 p-6 rounded-sm">
              <h2 className="text-lg font-black text-white uppercase mb-4">Všetky termíny ({slots.length})</h2>
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {slots.length === 0 && <p className="text-gray-500">Žiadne termíny</p>}
                {slots.map(slot => (
                  <div key={slot.id} className="flex items-center justify-between p-4 bg-brand-black border border-white/5 rounded-sm">
                    <div>
                      <p className="text-white font-black">{slot.date} • {slot.start_time.slice(0,5)} – {slot.end_time.slice(0,5)}</p>
                      <div className="flex items-center gap-3 mt-0.5">
                        <span className="text-xs text-gray-400">
                          {slot.type === 'kids' ? '👶 Detský' :
                           slot.type === 'junior' ? '🏅 Juniori' :
                           slot.type === 'women' ? '♀ Ženy' :
                           slot.type === 'men' ? '♂ Muži' :
                           slot.type === 'group' ? '👥 Skupinový' :
                           '🥊 Individuálny'}
                        </span>
                        <span className={`text-xs font-black uppercase ${slot.status === 'booked' ? 'text-red-500' : 'text-green-500'}`}>
                          {slot.status === 'booked' ? 'Obsadené' : 'Voľné'}
                        </span>
                      </div>
                    </div>
                    <button onClick={() => deleteSlot(slot.id)}
                      disabled={slot.status === 'booked'}
                      className="text-gray-500 hover:text-red-500 transition-colors disabled:opacity-30">
                      <Trash2 size={20} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'bookings' && (
          <div className="space-y-4">
            <div className="flex gap-4 items-center">
              <div className="relative flex-1">
                <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
                <input
                  type="text"
                  value={bookingFilter}
                  onChange={e => setBookingFilter(e.target.value)}
                  placeholder="Hľadaj podľa mena alebo emailu..."
                  className="w-full bg-brand-gray border border-white/10 py-3 pl-10 pr-4 text-white focus:border-brand-red outline-none rounded-sm text-sm"
                />
              </div>
              <button onClick={exportBookingsCSV}
                className="flex items-center gap-2 px-5 py-3 bg-brand-gray border border-white/10 text-gray-400 hover:text-white hover:border-white/30 transition-all font-black text-sm uppercase tracking-widest whitespace-nowrap">
                <Download size={16} /> Export CSV
              </button>
            </div>
            <AdminCalendar
              bookings={bookings.filter(b =>
                b.customer_name?.toLowerCase().includes(bookingFilter.toLowerCase()) ||
                b.customer_email?.toLowerCase().includes(bookingFilter.toLowerCase())
              )}
              slots={slots}
              onDeleteBooking={deleteBooking}
              onCancelBooking={cancelBooking}
            />
          </div>
        )}
      </div>

      {/* Toast */}
      {toast && (
        <div className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 px-5 py-4 rounded-sm font-black text-sm uppercase tracking-widest shadow-xl transition-all
          ${toast.type === 'success' ? 'bg-green-600 text-white' : 'bg-red-600 text-white'}`}>
          <span>{toast.type === 'success' ? '✓' : '✕'}</span>
          {toast.message}
        </div>
      )}
    </div>
  );
}