import { motion, AnimatePresence } from 'motion/react';
import { Search, MapPin, Bus, Ship, CloudRain, Bell, Navigation, Clock, ShieldCheck, ThermometerSun, ChevronRight, X, AlertTriangle } from 'lucide-react';
import { cn } from '../lib/utils';
import { useEffect, useState } from 'react';
import { collection, onSnapshot, query, where, limit } from 'firebase/firestore';
import { db, OperationType, handleFirestoreError } from '../lib/firebase';
import { Vehicle } from '../types';
import { navState } from '../lib/navState';
import { useRealWeather } from '../lib/weather';

export function Home({ onNavigate }: { onNavigate: (tab: string) => void }) {
  const weather = useRealWeather();
  const [activeVehicles, setActiveVehicles] = useState<Vehicle[]>([]);
  const [isAlertDismissed, setIsAlertDismissed] = useState(false);

  useEffect(() => {
    const q = query(collection(db, 'vehicles'), where('status', 'in', ['active', 'delayed']));
    const unsub = onSnapshot(q, (snap) => {
      const v = snap.docs
        .map(d => ({ id: d.id, ...d.data() } as Vehicle))
        .filter(vehicle => vehicle.driverId); // ONLY show real driver rides
      setActiveVehicles(v);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, 'vehicles');
    });
    return () => unsub();
  }, []);

  const [searchQuery, setSearchQuery] = useState('');
  const searchResults = searchQuery.trim().length >= 2
    ? activeVehicles.filter(v => v.routeName.toLowerCase().includes(searchQuery.toLowerCase()) || v.routeNumber.toLowerCase().includes(searchQuery.toLowerCase()))
    : [];

  const ActionCard = ({ title, icon: Icon, color, onClick, delay, subtitle, gradient, iconColor }: any) => (
    <motion.button 
      className={cn(
        "relative overflow-hidden flex flex-col justify-between p-4 sm:p-6 rounded-[28px] sm:rounded-[32px] border outline-none text-left shrink-0 backdrop-blur-[40px] shadow-[0_16px_40px_-12px_rgba(37,99,235,0.15)] group",
        "transition-all duration-400 ease-[cubic-bezier(0.34,1.56,0.64,1)] hover:scale-[1.03] hover:shadow-[0_20px_40px_-12px_rgba(37,99,235,0.25)] active:scale-[0.97]",
        color,
        gradient
      )}
      onClick={onClick}
      initial={{ opacity: 0, scale: 0.9, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.6, delay, type: "spring", stiffness: 300, damping: 24 }}
    >
      <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none mix-blend-overlay" />
      <div className="absolute -right-4 -bottom-4 sm:-right-8 sm:-bottom-8 opacity-[0.2] transform rotate-12 blur-[4px] group-hover:scale-110 group-hover:-rotate-12 transition-transform duration-700">
         <Icon className="w-24 h-24 sm:w-40 sm:h-40 text-current" />
      </div>
      <div className="relative z-10 flex flex-col h-full justify-between">
        <div className={cn("w-12 h-12 sm:w-14 sm:h-14 rounded-[16px] sm:rounded-[20px] bg-white shadow-[0_8px_16px_rgba(0,0,0,0.1)] flex items-center justify-center mb-4 sm:mb-8 transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-6", iconColor)}>
          <Icon className="w-6 h-6 sm:w-7 sm:h-7" strokeWidth={2.5} />
        </div>
        <div>
          <h3 className="text-lg sm:text-2xl font-extrabold tracking-tight mb-0.5 sm:mb-2 drop-shadow-sm leading-tight text-white">{title}</h3>
          {subtitle && <p className="text-[11px] sm:text-sm font-semibold text-white/90 drop-shadow-sm leading-tight">{subtitle}</p>}
        </div>
      </div>
    </motion.button>
  );

  return (
    <div className="w-full h-full overflow-y-auto pb-40 overflow-x-hidden scroll-smooth hide-scrollbar relative z-10">
      <AnimatePresence>
        {weather.alert && !isAlertDismissed && (
          <motion.div
            initial={{ opacity: 0, y: -50, height: 0 }}
            animate={{ opacity: 1, y: 0, height: 'auto' }}
            exit={{ opacity: 0, y: -50, height: 0 }}
            transition={{ duration: 0.3 }}
            className="w-full bg-red-950/80 border-b border-red-500/30 overflow-hidden sticky top-0 z-50 backdrop-blur-3xl"
          >
            <div className="flex items-start gap-3 p-5 max-w-7xl mx-auto backdrop-blur-3xl">
              <div className="mt-0.5 max-w-fit rounded-full bg-red-500/20 p-2 border border-red-500/30 animate-pulse shadow-[0_0_15px_rgba(239,68,68,0.3)]">
                <AlertTriangle className="w-5 h-5 text-red-500" />
              </div>
              <div className="flex-1">
                <h4 className="text-base font-bold text-slate-900 tracking-tight">System Alert</h4>
                <p className="text-sm text-red-200 mt-1 leading-relaxed opacity-90">{weather.alert}</p>
              </div>
              <button 
                onClick={() => setIsAlertDismissed(true)}
                className="p-2 hover:bg-white rounded-full transition-colors text-slate-500 hover:text-slate-900 shrink-0"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Dynamic Ambient Header */}
      <div className="relative pt-12 px-6 pb-6">
        <div className="flex justify-between items-start mb-8 relative z-10">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6, ease: "easeOut" }}>
            <p className="text-sm font-bold text-brand-blue uppercase tracking-widest mb-1 opacity-90">KeralaConnect</p>
            <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 mb-4 drop-shadow-sm">Morning</h1>
            <div className="flex flex-wrap gap-2.5">
              <div className="flex items-center gap-2 text-sm text-slate-900 font-semibold bg-white px-4 py-2 rounded-2xl border border-slate-100 backdrop-blur-2xl shadow-[0_8px_20px_rgba(149,157,165,0.1)]">
                <ThermometerSun className="w-4 h-4 text-amber-400" />
                <span>{weather.temp}°C</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-slate-900 font-semibold bg-white px-4 py-2 rounded-2xl border border-slate-100 backdrop-blur-2xl shadow-[0_8px_20px_rgba(149,157,165,0.1)]">
                <CloudRain className="w-4 h-4 text-sky-400" />
                <span>{weather.condition}</span>
              </div>
            </div>
          </motion.div>
          <motion.button 
            initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }}
            className="w-14 h-14 rounded-[20px] bg-white border border-slate-100 flex items-center justify-center relative backdrop-blur-3xl hover:bg-slate-50 transition-all shadow-[0_8px_20px_rgba(149,157,165,0.1)] hover:shadow-xl hover:-translate-y-1"
          >
            <Bell className="w-6 h-6 text-slate-900" strokeWidth={2} />
            <span className="absolute top-3 right-3 w-3 h-3 bg-brand-blue rounded-full border-2 border-[#101426]"></span>
          </motion.button>
        </div>

        {/* Global Search */}
        <motion.div 
          className="relative group mt-4 z-50 mb-4"
          initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div className="absolute inset-0 bg-brand-blue/20 rounded-[28px] blur-2xl transition-opacity opacity-0 group-focus-within:opacity-50"></div>
          <div className="relative bg-white backdrop-blur-3xl border border-slate-100 hover:border-brand-blue/50 focus-within:border-brand-blue rounded-[28px] flex items-center px-6 py-4.5 shadow-[0_12px_40px_rgba(149,157,165,0.15)] transition-all">
            <Search className="w-6 h-6 text-brand-blue mr-3" />
            <input 
              type="text" 
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Where to?" 
              className="bg-transparent border-none outline-none flex-1 text-slate-900 placeholder-white/40 text-lg font-semibold"
            />
          </div>
          
          {searchQuery.trim().length > 1 && (
            <div className="absolute top-[calc(100%+12px)] left-0 right-0 bg-white backdrop-blur-3xl border border-slate-100 rounded-[28px] shadow-[0_12px_40px_rgba(149,157,165,0.15)] overflow-hidden animate-in fade-in slide-in-from-top-2 duration-300 z-50">
               {searchResults.length === 0 ? (
                 <div className="p-6 text-slate-500 text-center font-medium">No results found for "{searchQuery}"</div>
               ) : (
                 <div className="max-h-[300px] overflow-y-auto hide-scrollbar p-2">
                   {searchResults.map((r, i) => (
                     <div 
                       key={r.id}
                       onClick={() => {
                          setSearchQuery('');
                          navState.setSelectedVehicleId(r.id);
                          onNavigate('map');
                       }}
                       className={cn(
                         "p-4 flex items-center gap-4 cursor-pointer hover:bg-white active:bg-white transition-colors rounded-[20px]",
                       )}
                     >
                       <div className="w-12 h-12 rounded-[16px] bg-brand-blue/10 border border-brand-blue/20 flex items-center justify-center shrink-0">
                         {r.type === 'bus' ? <Bus className="w-6 h-6 text-brand-blue" /> : <Ship className="w-6 h-6 text-brand-blue" />}
                       </div>
                       <div className="flex-1">
                         <div className="font-bold text-slate-900 leading-tight mb-1">{r.routeName}</div>
                         <div className="flex items-center gap-2 text-xs">
                           <span className="font-mono bg-white px-2 py-0.5 rounded-md text-slate-600">{r.routeNumber}</span>
                           <span className="text-slate-500 flex items-center capitalize">{r.crowdLevel}</span>
                         </div>
                       </div>
                     </div>
                   ))}
                 </div>
               )}
            </div>
          )}
        </motion.div>
      </div>

      {/* Main Actions - Grid Layout */}
      <div className="px-6 mb-10">
        <div className="grid grid-cols-2 gap-4">
          <ActionCard 
            title="Live Commute" 
            subtitle="Realtime Track"
            icon={MapPin} 
            color="w-full flex-1 aspect-square sm:aspect-auto sm:h-[180px] border-none text-white shadow-[0_16px_40px_-12px_rgba(59,130,246,0.3)]"
            gradient="bg-gradient-to-br from-brand-blue to-brand-indigo"
            iconColor="text-brand-blue"
            onClick={() => onNavigate('map')}
            delay={0.2}
          />
          <ActionCard 
            title="City Buses" 
            subtitle="View schedules"
            icon={Bus} 
            color="w-full flex-1 aspect-square sm:aspect-auto sm:h-[180px] border-none text-white shadow-[0_16px_40px_-12px_rgba(14,165,233,0.3)]"
            gradient="bg-gradient-to-br from-brand-sky to-brand-blue"
            iconColor="text-brand-sky"
            onClick={() => onNavigate('routes')}
            delay={0.3}
          />
          <ActionCard 
            title="Water Metro" 
            subtitle="Nearest jetties"
            icon={Ship} 
            color="w-full flex-1 aspect-square sm:aspect-auto sm:h-[180px] border-none text-white shadow-[0_16px_40px_-12px_rgba(16,185,129,0.3)]"
            gradient="bg-gradient-to-br from-brand-mint to-teal-500"
            iconColor="text-brand-mint"
            onClick={() => onNavigate('routes')}
            delay={0.4}
          />
          <ActionCard 
            title="My Routes" 
            subtitle="Saved custom"
            icon={Navigation} 
            color="w-full flex-1 aspect-square sm:aspect-auto sm:h-[180px] border-none text-white shadow-[0_16px_40px_-12px_rgba(139,92,246,0.3)]"
            gradient="bg-gradient-to-br from-brand-purple to-brand-indigo"
            iconColor="text-brand-purple"
            onClick={() => onNavigate('routes')}
            delay={0.5}
          />
        </div>
      </div>

      {/* Live Network Status card */}
      <div className="px-4 sm:px-6 mb-8 sm:mb-10">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="relative bg-white/70 backdrop-blur-[40px] border border-white/80 rounded-[28px] sm:rounded-[32px] p-5 sm:p-6 flex flex-col overflow-hidden shadow-[0_16px_40px_-12px_rgba(37,99,235,0.15),inset_0_1px_2px_rgba(255,255,255,0.8)]"
        >
          <div className="absolute top-0 right-0 w-64 h-64 bg-brand-blue/15 blur-[60px] rounded-full mix-blend-multiply pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-brand-coral/10 blur-[60px] rounded-full mix-blend-multiply pointer-events-none -translate-x-1/2 translate-y-1/2" />
          
          <div className="flex items-center justify-between mb-4 sm:mb-6 relative z-10">
            <div className="flex items-center gap-3">
              <div className="relative flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12">
                <div className="absolute inset-0 bg-brand-blue/20 rounded-full animate-ping" />
                <div className="relative w-10 h-10 sm:w-12 sm:h-12 bg-white border border-white/80 shadow-sm rounded-full flex items-center justify-center">
                  <Navigation className="w-4 h-4 sm:w-5 sm:h-5 text-brand-blue" />
                </div>
              </div>
              <p className="text-base sm:text-lg font-extrabold text-slate-800 tracking-tight">Live Network Status</p>
            </div>
          </div>
          
          <div className="flex items-end justify-between relative z-10">
             <div className="flex items-baseline gap-2">
                <h3 className="text-6xl sm:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-br from-brand-blue to-brand-indigo tracking-tighter drop-shadow-sm">{activeVehicles.length}</h3>
                <p className="text-slate-500 font-extrabold uppercase tracking-widest text-[10px] sm:text-sm mb-1.5 sm:mb-2">Active</p>
             </div>
             <button 
               onClick={() => onNavigate('map')}
               className="h-12 sm:h-14 px-6 sm:px-8 bg-brand-blue hover:bg-brand-indigo text-white text-sm sm:text-base font-extrabold rounded-[20px] sm:rounded-[24px] flex items-center justify-center shadow-[0_12px_24px_-8px_rgba(37,99,235,0.6)] transition-all hover:scale-105 active:scale-95 duration-300"
             >
               Track Now
             </button>
          </div>
        </motion.div>
      </div>

      {/* Live Vehicles Nearby */}
      <div className="px-4 sm:px-6 mb-8">
         <div className="flex justify-between items-center mb-6">
           <h2 className="text-xl font-bold text-slate-800 tracking-tight flex items-center gap-3">
             Nearby Transit
           </h2>
           <button onClick={() => onNavigate('map')} className="text-sm font-bold text-brand-blue flex items-center hover:opacity-80 transition-opacity">
             View All <ChevronRight className="w-5 h-5 ml-0.5" />
           </button>
         </div>

         <div className="flex flex-col gap-3 sm:gap-4">
           {activeVehicles.length === 0 ? (
             <div className="bg-white/80 border border-white/80 rounded-[32px] p-8 text-center backdrop-blur-xl shadow-sm">
                <div className="w-16 h-16 rounded-[20px] bg-slate-50 mx-auto flex items-center justify-center mb-4 border border-slate-100">
                  <MapPin className="w-8 h-8 text-slate-400" />
                </div>
                <p className="text-slate-500 font-bold text-lg">Looking for active vehicles...</p>
             </div>
           ) : (
             activeVehicles.slice(0, 5).map((v, i) => (
               <motion.div 
                 key={v.id}
                 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 * i, type: "spring", stiffness: 300, damping: 24 }}
                 className="bg-white/80 backdrop-blur-[40px] border border-white/80 hover:border-brand-sky/60 rounded-[24px] sm:rounded-[28px] p-4 sm:p-5 flex items-center justify-between cursor-pointer group shadow-[0_12px_32px_-12px_rgba(37,99,235,0.1),inset_0_1px_2px_rgba(255,255,255,0.8)] hover:shadow-[0_16px_40px_-12px_rgba(37,99,235,0.25)] hover:-translate-y-1 transition-all"
                 onClick={() => {
                    navState.setSelectedVehicleId(v.id);
                    onNavigate('map');
                 }}
               >
                 <div className="flex items-center gap-3 sm:gap-5">
                   <div className={cn(
                     "w-12 h-12 sm:w-14 sm:h-14 rounded-[16px] sm:rounded-[20px] shadow-sm flex items-center justify-center shrink-0 relative overflow-hidden transition-transform duration-300 group-hover:scale-105",
                     v.type === 'bus' ? "bg-brand-blue" : "bg-brand-sky"
                   )}>
                     <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                     {v.type === 'bus' ? <Bus className="w-6 h-6 sm:w-7 sm:h-7 text-white relative z-10" /> : <Ship className="w-6 h-6 sm:w-7 sm:h-7 text-white relative z-10" />}
                   </div>
                   <div>
                     <h4 className="font-extrabold text-slate-800 text-base sm:text-lg leading-tight mb-1">
                       {v.routeName}
                     </h4>
                     <div className="flex items-center gap-2">
                        <span className="text-[10px] sm:text-xs font-mono font-bold bg-slate-100 px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-md text-brand-blue">{v.routeNumber}</span>
                        <span className="w-1 h-1 rounded-full bg-slate-200"></span>
                        <span className="text-xs sm:text-sm font-semibold text-slate-500 flex items-center"><Clock className="w-3 h-3 sm:w-3.5 sm:h-3.5 mr-1 text-brand-blue/60" /> {v.speed} km/h</span>
                     </div>
                   </div>
                 </div>
                 <div className="text-right flex flex-col items-end">
                   <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center group-hover:bg-brand-blue group-hover:text-white text-slate-400 group-hover:shadow-[0_8px_16px_rgba(37,99,235,0.3)] transition-all">
                      <ChevronRight className="w-5 h-5" />
                   </div>
                 </div>
               </motion.div>
             ))
           )}
         </div>
      </div>
      
      {/* Spacer for bottom nav */}
      <div className="h-4"></div>
    </div>
  );
}
