import React, { useState, useEffect } from 'react';
import { 
  Calendar, 
  ChevronLeft, 
  ChevronRight, 
  Gift, 
  Coffee, 
  PartyPopper,
  MapPin,
  Clock
} from 'lucide-react';
import { subscribeToEvents } from '../services/firebaseService';

export default function EventsView() {
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = subscribeToEvents((data) => {
      setEvents(data);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const getIcon = (type: string) => {
    switch (type) {
      case 'workshop': return Coffee;
      case 'holiday': return Gift;
      default: return PartyPopper;
    }
  };

  const getColor = (type: string) => {
    switch (type) {
      case 'workshop': return 'bg-amber-500 text-white';
      case 'holiday': return 'bg-secondary text-white';
      default: return 'bg-primary text-white';
    }
  };

  return (
    <div className="space-y-8 pb-20">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight">Sự kiện & Ngày lễ</h1>
          <p className="text-on-surface-variant">Lịch trình các hoạt động nội bộ công ty</p>
        </div>
        <div className="flex gap-2">
          <button className="p-3 rounded-xl bg-surface-container-lowest shadow-sm hover:bg-surface-container-low transition-colors">
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button className="p-3 rounded-xl bg-surface-container-lowest shadow-sm hover:bg-surface-container-low transition-colors">
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Calendar Widget */}
        <div className="lg:col-span-1 bg-surface-container-lowest p-8 rounded-[2.5rem] shadow-[0px_12px_32px_rgba(20,86,193,0.04)]">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-xl font-bold">Tháng 03, 2026</h2>
            <Calendar className="w-5 h-5 text-primary" />
          </div>
          <div className="grid grid-cols-7 gap-2 mb-4">
            {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map(d => (
              <div key={d} className="text-center text-[10px] font-bold text-on-surface-variant/40 uppercase">{d}</div>
            ))}
          </div>
          <div className="grid grid-cols-7 gap-2">
            {Array.from({ length: 31 }).map((_, i) => (
              <div 
                key={i} 
                className={`aspect-square flex items-center justify-center rounded-xl text-sm font-bold transition-all cursor-pointer ${
                  i + 1 === 29 ? 'bg-primary text-white shadow-lg shadow-primary/30 scale-110' : 'hover:bg-surface-container-low'
                }`}
              >
                {i + 1}
              </div>
            ))}
          </div>
        </div>

        {/* Events List */}
        <div className="lg:col-span-2 space-y-6">
          <h2 className="text-xl font-bold flex items-center gap-3">
            Sắp tới
            <span className="px-2 py-0.5 rounded-md bg-primary/10 text-primary text-xs font-bold">{events.length}</span>
          </h2>
          <div className="space-y-4">
            {events.length > 0 ? events.map((event, i) => {
              const Icon = getIcon(event.type);
              return (
                <div key={i} className="bg-surface-container-lowest p-6 rounded-3xl flex gap-6 items-center shadow-sm hover:shadow-md transition-all group">
                  <div className={`w-16 h-16 rounded-2xl ${getColor(event.type)} flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform`}>
                    <Icon className="w-8 h-8" />
                  </div>
                  <div className="flex-grow">
                    <h3 className="text-xl font-bold mb-2">{event.title}</h3>
                    <div className="flex flex-wrap gap-4 text-sm text-on-surface-variant font-medium">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="w-4 h-4 text-primary/60" />
                        {event.date?.toDate ? event.date.toDate().toLocaleDateString() : event.date}
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Clock className="w-4 h-4 text-primary/60" />
                        {event.time || 'Cả ngày'}
                      </div>
                      <div className="flex items-center gap-1.5">
                        <MapPin className="w-4 h-4 text-primary/60" />
                        {event.location}
                      </div>
                    </div>
                  </div>
                  <button className="p-3 rounded-full bg-surface-container-low text-on-surface-variant hover:bg-primary hover:text-white transition-all">
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              );
            }) : (
              <div className="p-12 text-center bg-surface-container-low rounded-3xl">
                <p className="text-on-surface-variant font-bold">Không có sự kiện nào sắp tới</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
