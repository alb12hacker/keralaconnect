import { User } from 'firebase/auth';
import { auth } from '../lib/firebase';
import { LogOut, History, Bell, Navigation, Settings, HelpCircle, Shield, ChevronRight, Bus } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useState, useEffect } from 'react';
import { startDriverTracking, stopDriverTracking, trackingEngine } from '../lib/driverTracking';

export function ProfileScreen({ user }: { user: User }) {
  const [isDriving, setIsDriving] = useState(trackingEngine.isTracking);
  const [busId, setBusId] = useState(trackingEngine.activeBusId);
  const [routeNum, setRouteNum] = useState(trackingEngine.activeRouteNumber);
  const [routeName, setRouteName] = useState(trackingEngine.activeRouteName);
  const [vehicleType, setVehicleType] = useState<'bus' | 'ferry'>(trackingEngine.activeType || 'bus');

  useEffect(() => {
    const unsub = trackingEngine.subscribe(() => {
      setIsDriving(trackingEngine.isTracking);
      if (trackingEngine.isTracking) {
        setBusId(trackingEngine.activeBusId);
        setRouteNum(trackingEngine.activeRouteNumber);
        setRouteName(trackingEngine.activeRouteName);
        setVehicleType(trackingEngine.activeType);
      }
    });
    return unsub;
  }, []);

  const handleLogout = () => {
    auth.signOut();
  };

  const toggleDriverMode = async () => {
    if (isDriving) {
      stopDriverTracking(busId || `drvr-${user.uid.substring(0, 5)}`);
      setIsDriving(false);
    } else {
      if (!busId || !routeNum || !routeName) {
        alert("Please enter Bus/Ferry ID, Route Number, and Route Name to start.");
        return;
      }
      await startDriverTracking(busId, routeName, routeNum, vehicleType);
      setIsDriving(true);
    }
  };

  const menuItems = [
    { icon: History, label: 'Travel History' },
    { icon: Bell, label: 'Notification Settings' },
    { icon: Navigation, label: 'Route Preferences' },
    { icon: Shield, label: 'Privacy & Security' },
    { icon: HelpCircle, label: 'Help & Support' },
  ];

  return (
    <div className="pt-10 sm:pt-16 px-4 sm:px-6 pb-40 h-full overflow-y-auto bg-slate-50 relative z-10 font-sans">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease: "easeOut" }} className="mb-6 sm:mb-10">
        <p className="text-xs sm:text-sm font-bold text-brand-blue uppercase tracking-widest mb-1 opacity-90">Account</p>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 drop-shadow-sm">Your Profile</h1>
      </motion.div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.1, duration: 0.5 }}
        className="flex items-center gap-4 sm:gap-6 mb-8 sm:mb-10 bg-white/80 p-5 sm:p-6 rounded-[28px] sm:rounded-[32px] border border-white/80 backdrop-blur-2xl shadow-[0_12px_32px_-12px_rgba(37,99,235,0.1),inset_0_1px_2px_rgba(255,255,255,0.8)] relative overflow-hidden group"
      >
        <div className="absolute top-0 right-0 w-32 h-32 bg-brand-blue/10 blur-[40px] rounded-full mix-blend-multiply -mb-10 -mr-10" />
        
        {user.photoURL ? (
          <img src={user.photoURL} alt="Profile" className="w-20 h-20 sm:w-24 sm:h-24 rounded-full border-2 border-brand-blue/50 shadow-[0_0_20px_rgba(37,99,235,0.2)] object-cover relative z-10 shrink-0" />
        ) : (
          <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-[20px] sm:rounded-[24px] bg-slate-50 border border-slate-100 flex items-center justify-center text-3xl sm:text-4xl shadow-sm relative z-10 font-bold overflow-hidden shrink-0">
            <div className="absolute inset-0 bg-gradient-to-br from-brand-blue/10 to-transparent"></div>
            <span className="relative z-10 mix-blend-overlay opacity-80 text-brand-blue">{user.displayName?.charAt(0) || "C"}</span>
          </div>
        )}
        <div className="relative z-10 min-w-0 flex-1">
          <h2 className="text-xl sm:text-2xl font-extrabold mb-1 tracking-tight text-slate-900 truncate">{user.displayName || "Commuter"}</h2>
          <p className="text-xs sm:text-sm text-slate-500 font-medium mb-2.5 sm:mb-3 truncate">{user.email}</p>
          <div className="text-[9px] sm:text-[10px] font-black uppercase tracking-widest bg-brand-blue/10 text-brand-blue px-2.5 py-1 rounded-md inline-flex items-center border border-brand-blue/20">
            Verified User
          </div>
        </div>
      </motion.div>

      {/* Driver Mode Section */}
      <motion.div 
        initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15, duration: 0.5 }}
        className={`mb-8 sm:mb-10 p-5 sm:p-6 rounded-[28px] sm:rounded-[32px] border backdrop-blur-3xl transition-all duration-500 overflow-hidden relative shadow-[0_12px_32px_-12px_rgba(0,0,0,0.05),inset_0_1px_2px_rgba(255,255,255,0.8)] ${isDriving ? 'bg-brand-blue/5 border-brand-blue/30 shadow-[0_0_40px_rgba(37,99,235,0.1)]' : 'bg-white/80 border-white/80'}`}
      >
        {isDriving && <div className="absolute top-0 left-0 w-full h-1 bg-brand-blue animate-pulse"></div>}

        <div className="flex items-center gap-4 sm:gap-5 mb-5 sm:mb-6 relative z-10">
          <div className={`w-12 h-12 sm:w-14 sm:h-14 rounded-[16px] sm:rounded-[20px] flex items-center justify-center shrink-0 transition-all duration-300 ${isDriving ? 'bg-brand-blue text-white shadow-[0_0_20px_rgba(37,99,235,0.5)] scale-110' : 'bg-slate-50 text-slate-400 border border-slate-100 shadow-sm'}`}>
            <Bus className="w-5 h-5 sm:w-6 sm:h-6" />
          </div>
          <div>
            <h3 className="text-lg sm:text-xl font-extrabold text-slate-900 tracking-tight">Driver Mode</h3>
            <p className="text-xs sm:text-sm font-medium text-brand-blue/80 mt-0.5">{isDriving ? 'Actively sharing live location' : 'Broadcast your location'}</p>
          </div>
        </div>

        <AnimatePresence>
          {!isDriving && (
            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="space-y-3 mb-5 sm:mb-6 overflow-hidden">
              <div className="flex bg-slate-50 border border-slate-100 rounded-[12px] sm:rounded-[16px] p-1">
                <button
                  className={`flex-1 py-2 sm:py-2.5 text-xs sm:text-sm font-bold rounded-lg transition-all ${vehicleType === 'bus' ? 'bg-white text-brand-blue shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                  onClick={() => setVehicleType('bus')}
                >
                  Bus
                </button>
                <button
                  className={`flex-1 py-2 sm:py-2.5 text-xs sm:text-sm font-bold rounded-lg transition-all ${vehicleType === 'ferry' ? 'bg-white text-brand-blue shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                  onClick={() => setVehicleType('ferry')}
                >
                  Ferry
                </button>
              </div>
              <input 
                type="text" placeholder="Vehicle ID (e.g. KL-07-1234)" value={busId} onChange={e => setBusId(e.target.value)}
                className="w-full bg-slate-50 border border-slate-100 rounded-[12px] sm:rounded-[16px] px-4 py-3 sm:py-4 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-brand-blue/50 focus:bg-white transition-all font-mono text-xs sm:text-sm"
              />
              <input 
                type="text" placeholder="Route Number (e.g. KL-01)" value={routeNum} onChange={e => setRouteNum(e.target.value)}
                className="w-full bg-slate-50 border border-slate-100 rounded-[12px] sm:rounded-[16px] px-4 py-3 sm:py-4 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-brand-blue/50 focus:bg-white transition-all font-mono text-xs sm:text-sm"
              />
              <input 
                type="text" placeholder="Route Name (e.g. Aluva - Vyttila)" value={routeName} onChange={e => setRouteName(e.target.value)}
                className="w-full bg-slate-50 border border-slate-100 rounded-[12px] sm:rounded-[16px] px-4 py-3 sm:py-4 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-brand-blue/50 focus:bg-white transition-all font-semibold text-sm sm:text-base"
              />
            </motion.div>
          )}
        </AnimatePresence>

        <button 
          onClick={toggleDriverMode}
          className={`w-full py-3.5 sm:py-4 rounded-[16px] sm:rounded-[20px] font-extrabold tracking-wide text-base sm:text-lg transition-all duration-300 relative z-10 ${isDriving ? 'bg-red-50 text-red-500 border border-red-100 hover:bg-red-100 shadow-sm' : 'bg-brand-blue hover:bg-brand-indigo text-white shadow-[0_8px_24px_-8px_rgba(37,99,235,0.6)] hover:-translate-y-0.5'}`}
        >
          {isDriving ? 'STOP TRIP & TRACKING' : 'START LIVE TRIP'}
        </button>
      </motion.div>
      
      <div className="space-y-2.5 sm:space-y-3">
        <h3 className="text-lg sm:text-xl font-extrabold text-slate-900 tracking-tight mb-4 sm:mb-5 px-2">Settings</h3>
        {menuItems.map((item, index) => (
          <motion.div 
            key={item.label}
            initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 + (index * 0.05), duration: 0.4 }}
            className="bg-white/80 backdrop-blur-[40px] border border-white/80 rounded-[20px] sm:rounded-[24px] p-4 sm:p-5 flex justify-between items-center cursor-pointer hover:bg-white hover:border-brand-blue/30 transition-all duration-300 group shadow-[0_4px_12px_rgba(0,0,0,0.02),inset_0_1px_2px_rgba(255,255,255,0.8)] hover:shadow-[0_8px_20px_rgba(149,157,165,0.1)]"
          >
             <div className="flex items-center gap-3 sm:gap-4">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-[14px] sm:rounded-[16px] bg-slate-50 group-hover:bg-brand-blue/20 flex items-center justify-center transition-all duration-300 border border-transparent group-hover:border-brand-blue/30 shadow-sm">
                  <item.icon className="w-4 h-4 sm:w-5 sm:h-5 text-slate-400 group-hover:text-brand-blue transition-colors" />
                </div>
                <span className="font-bold text-slate-700 group-hover:text-slate-900 transition-colors text-sm sm:text-base">{item.label}</span>
             </div>
             <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 text-slate-300 group-hover:text-brand-blue transition-colors" />
          </motion.div>
        ))}
      </div>

      <motion.button 
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
        onClick={handleLogout} 
        className="mt-10 sm:mt-12 flex items-center justify-center gap-2 sm:gap-3 w-full py-4 sm:py-5 rounded-[20px] sm:rounded-[24px] bg-red-50 text-red-500 font-extrabold tracking-wide text-base sm:text-lg border border-red-100 active:scale-[0.98] hover:bg-red-100 transition-all group backdrop-blur-xl shadow-sm"
      >
        <LogOut className="w-5 h-5 sm:w-6 sm:h-6 group-hover:-translate-x-1 group-hover:scale-110 transition-all" />
        Log Out
      </motion.button>
      
      {/* Safe Area padding */}
      <div className="h-8"></div>
    </div>
  );
}
