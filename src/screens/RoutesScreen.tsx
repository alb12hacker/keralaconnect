import { motion } from 'motion/react';
import { Route, Clock, ChevronRight, AlertCircle, Ship, Bus, Users } from 'lucide-react';
import { cn } from '../lib/utils';
import { useEffect, useState } from 'react';
import { collection, onSnapshot, query, where } from 'firebase/firestore';
import { db, OperationType, handleFirestoreError } from '../lib/firebase';
import { Vehicle } from '../types';
import { navState } from '../lib/navState';

export function RoutesScreen({ onNavigate }: { onNavigate: (tab: string) => void }) {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [filter, setFilter] = useState('All');

  useEffect(() => {
    const q = query(collection(db, 'vehicles'), where('status', 'in', ['active', 'delayed']));
    const unsub = onSnapshot(q, (snap) => {
      const v = snap.docs
        .map(d => ({ id: d.id, ...d.data() } as Vehicle))
        .filter(vehicle => vehicle.driverId); // ONLY show real driver rides
      setVehicles(v);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, 'vehicles');
    });
    return () => unsub();
  }, []);

  const filteredVehicles = vehicles.filter(v => {
    if (filter === 'Buses') return v.type === 'bus';
    if (filter === 'Ferries') return v.type === 'ferry';
    if (filter === 'Delayed') return v.status === 'delayed';
    return true; // 'All'
  });

  const handleRouteClick = (vid: string) => {
    navState.setSelectedVehicleId(vid);
    onNavigate('map');
  };

  return (
    <div className="pt-10 sm:pt-16 px-4 sm:px-6 pb-40 h-full overflow-y-auto bg-slate-50 relative z-10 font-sans">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease: "easeOut" }}>
        <p className="text-xs sm:text-sm font-bold text-brand-blue uppercase tracking-widest mb-1 opacity-90">Live Transit</p>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 mb-2 drop-shadow-sm">Active Routes</h1>
        <p className="text-sm sm:text-base text-slate-500 font-medium mb-6 sm:mb-8 leading-relaxed max-w-xs">Select any route for real-time tracking, metrics, and ETAs.</p>
      </motion.div>

      <div className="flex gap-2.5 sm:gap-3 mb-6 sm:mb-8 overflow-x-auto pb-2 hide-scrollbar">
         {['All', 'Buses', 'Ferries', 'Delayed'].map((t, i) => (
           <button 
             key={t} 
             onClick={() => setFilter(t)}
             className={cn(
             "px-5 sm:px-6 py-2.5 sm:py-3 rounded-[16px] sm:rounded-[20px] whitespace-nowrap text-xs sm:text-sm font-bold transition-all duration-300",
             filter === t ? "bg-slate-900 text-white shadow-[0_4px_20px_rgba(15,23,42,0.2)] scale-105" : "bg-white border border-slate-100 hover:bg-slate-50 text-slate-500 hover:text-slate-900"
           )}>
              {t}
           </button>
         ))}
      </div>

      <div className="flex flex-col gap-3 sm:gap-4">
        {filteredVehicles.length === 0 ? (
           <div className="text-center py-16 text-slate-400 font-bold bg-white rounded-[32px] border border-slate-50 flex flex-col items-center justify-center">
             <Route className="w-10 h-10 sm:w-12 sm:h-12 mb-4 opacity-50 text-brand-blue" />
             No routes found
           </div>
        ) : (
          filteredVehicles.map((r, i) => (
             <motion.div 
               key={r.id}
               onClick={() => handleRouteClick(r.id)}
               initial={{ opacity: 0, scale: 0.98, y: 10 }} animate={{ opacity: 1, scale: 1, y: 0 }} transition={{ delay: i * 0.05, type: "spring", stiffness: 300, damping: 24 }}
               className="bg-white/80 backdrop-blur-[40px] border border-white/80 hover:border-brand-sky/60 transition-all duration-400 p-4 sm:p-6 rounded-[28px] sm:rounded-[32px] flex items-center gap-4 sm:gap-5 cursor-pointer relative overflow-hidden group shadow-[0_12px_32px_-12px_rgba(37,99,235,0.1),inset_0_1px_2px_rgba(255,255,255,0.8)] hover:shadow-[0_16px_40px_-12px_rgba(37,99,235,0.25)] hover:-translate-y-1"
             >
                <div className="absolute inset-0 bg-gradient-to-r from-brand-sky/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                {r.status === 'delayed' && <div className="absolute top-0 right-0 w-24 h-24 sm:w-32 sm:h-32 bg-red-500/10 blur-[40px] rounded-full translate-x-1/2 -translate-y-1/2 pointer-events-none"></div>}
                
                <div className={cn(
                  "w-12 h-12 sm:w-16 sm:h-16 rounded-[16px] sm:rounded-[24px] flex items-center justify-center shrink-0 relative overflow-hidden shadow-[0_8px_16px_rgba(0,0,0,0.05)] transition-transform duration-300 group-hover:scale-105",
                  r.type === 'bus' ? "bg-brand-blue" : "bg-brand-sky"
                )}>
                  {r.type === 'bus' ? <Bus className="w-6 h-6 sm:w-8 sm:h-8 text-white relative z-10" /> : <Ship className="w-6 h-6 sm:w-8 sm:h-8 text-white relative z-10" />}
                </div>
                
                <div className="flex-1 min-w-0 z-10">
                  <div className="flex items-center gap-2 mb-1.5 sm:mb-2">
                    <span className="font-mono text-[10px] sm:text-xs px-2 sm:px-3 py-0.5 sm:py-1 rounded-md sm:rounded-lg bg-slate-100 text-brand-blue font-extrabold tracking-widest">{r.routeNumber}</span>
                    {r.status === 'delayed' && <span className="text-[10px] uppercase font-bold text-red-500 bg-red-50 py-0.5 sm:py-1 px-2 mb:-0.5 sm:mb-0 rounded-md sm:rounded-lg flex items-center gap-1.5 whitespace-nowrap"><AlertCircle className="w-3 h-3 sm:w-3.5 sm:h-3.5" /> Delayed</span>}
                  </div>
                  <h3 className="font-extrabold text-lg sm:text-xl leading-tight mb-1 sm:mb-2 truncate text-slate-800 drop-shadow-sm">{r.routeName}</h3>
                  <div className="flex items-center gap-2.5 sm:gap-3.5 text-xs sm:text-sm font-bold text-slate-400">
                    <span className="flex items-center gap-1 sm:gap-1.5 text-brand-blue"><Clock className="w-3 h-3 sm:w-4 sm:h-4" /> {r.speed} km/h</span>
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-200"></span>
                    <span className="flex items-center gap-1 sm:gap-1.5 capitalize text-slate-500"><Users className="w-3 h-3 sm:w-4 sm:h-4 text-brand-blue/50" /> {r.crowdLevel}</span>
                  </div>
                </div>

                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full sm:rounded-[20px] bg-slate-50 group-hover:bg-brand-blue shadow-sm group-hover:shadow-[0_8px_16px_rgba(37,99,235,0.3)] flex items-center justify-center transition-all duration-300 shrink-0 z-10 text-slate-400 group-hover:text-white">
                  <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
                </div>
             </motion.div>
          ))
        )}
      </div>
      
      {/* Safe Area padding */}
      <div className="h-8"></div>
    </div>
  );
}
