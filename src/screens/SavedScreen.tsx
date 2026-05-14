import { motion } from 'motion/react';
import { Plus, Compass, MapPin } from 'lucide-react';
import { cn } from '../lib/utils';
import { auth } from '../lib/firebase';

export function SavedScreen() {
  return (
    <div className="pt-10 sm:pt-16 px-4 sm:px-6 pb-40 h-full overflow-y-auto bg-slate-50 relative z-10 font-sans">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease: "easeOut" }}>
        <p className="text-xs sm:text-sm font-bold text-brand-blue uppercase tracking-widest mb-1 opacity-90">My Network</p>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 mb-2 drop-shadow-sm">Saved Trips</h1>
        <p className="text-sm sm:text-base text-slate-500 font-medium mb-8 sm:mb-10 leading-relaxed max-w-xs">Quick access to your daily commute routines and regular transit routes.</p>
      </motion.div>

      <div className="grid grid-cols-1 gap-4 mb-8 sm:mb-10">
        <motion.button 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
          className="rounded-[28px] sm:rounded-[32px] p-6 flex flex-col items-center justify-center border-2 border-dashed border-slate-200 bg-white hover:bg-white hover:border-brand-blue/50 hover:shadow-[0_8px_32px_rgba(37,99,235,0.1)] transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] min-h-[140px] sm:min-h-[160px] group overflow-hidden relative backdrop-blur-xl"
        >
          <div className="absolute inset-0 bg-brand-blue/5 opacity-0 group-hover:opacity-100 transition-opacity" />
          <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-[16px] sm:rounded-2xl bg-white border border-slate-100 flex items-center justify-center mb-4 group-hover:bg-brand-blue/20 group-hover:border-brand-blue/30 transition-all duration-300 shadow-md">
             <Plus className="w-6 h-6 sm:w-8 sm:h-8 text-slate-500 group-hover:text-brand-blue transition-colors" />
          </div>
          <span className="font-extrabold text-sm sm:text-base text-slate-600 group-hover:text-brand-blue tracking-wide">Add New Route</span>
        </motion.button>
      </div>

      <div>
        <h2 className="text-xl sm:text-2xl font-extrabold mb-4 sm:mb-6 text-slate-900 tracking-tight flex items-center gap-2">
           <MapPin className="w-5 h-5 sm:w-6 sm:h-6 text-brand-blue" />
           Recent Journeys
        </h2>
        <div className="flex flex-col gap-3 sm:gap-4">
             <div className="text-center py-12 sm:py-16 text-slate-400 font-bold bg-white/80 backdrop-blur-[40px] rounded-[28px] sm:rounded-[32px] border border-white/80 flex flex-col items-center justify-center shadow-[0_8px_20px_rgba(149,157,165,0.1)]">
               <div className="w-12 h-12 sm:w-16 sm:h-16 bg-white rounded-[16px] sm:rounded-2xl flex items-center justify-center mb-4 border border-slate-50 shadow-sm">
                 <Compass className="w-6 h-6 sm:w-8 sm:h-8 opacity-50 text-brand-blue" />
               </div>
               <p className="max-w-[200px] text-sm sm:text-base leading-relaxed">No recent journeys found. Take a trip to see it here!</p>
             </div>
        </div>
      </div>
      
      {/* Safe Area padding */}
      <div className="h-8"></div>
    </div>
  );
}
