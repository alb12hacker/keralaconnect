import { useState } from 'react';
import { motion } from 'motion/react';
import { Bus, Ship, Navigation, CloudRain } from 'lucide-react';
import { DriverLoginScreen } from './DriverLoginScreen';

interface LoginScreenProps {
  onLogin: () => void;
}

export function LoginScreen({ onLogin }: LoginScreenProps) {
  const [showDriverLogin, setShowDriverLogin] = useState(false);

  if (showDriverLogin) {
    return <DriverLoginScreen onBack={() => setShowDriverLogin(false)} />;
  }

  return (
    <div className="relative flex flex-col items-center justify-center h-full bg-slate-50 overflow-hidden px-8 font-sans w-full">
      {/* Background cinematic elements */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[20%] -left-[10%] w-[800px] h-[800px] bg-brand-blue/10 rounded-full blur-[120px] mix-blend-multiply" />
        <div className="absolute -bottom-[20%] -right-[10%] w-[800px] h-[800px] bg-brand-blue/10 rounded-full blur-[120px] mix-blend-multiply" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[1000px] bg-[radial-gradient(ellipse_at_center,_rgba(37,99,235,0.05)_0%,_rgba(0,0,0,0)_70%)]" />
        
        {/* Simulating moving map elements in background */}
        <motion.div 
          animate={{ x: [0, -30, 0], y: [0, 15, 0] }}
          transition={{ repeat: Infinity, duration: 15, ease: "linear" }}
          className="absolute inset-0 opacity-[0.03] bg-[radial-gradient(circle_at_center,_#0f172a_1px,_transparent_1px)] bg-[length:32px_32px]"
        />
      </div>

      <div className="relative z-10 w-full max-w-sm flex flex-col items-center">
        <motion.div 
          initial={{ opacity: 0, scale: 0.8, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.8, type: "spring", bounce: 0.4 }}
          className="w-28 h-28 bg-white border border-slate-100 rounded-[36px] backdrop-blur-2xl flex items-center justify-center shadow-[0_20px_40px_rgba(149,157,165,0.2)] mb-10 relative overflow-hidden group"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-brand-indigo/20 to-brand-indigo/20 rounded-[36px]" />
          <div className="absolute inset-0 bg-brand-blue/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <Navigation className="w-12 h-12 text-slate-900 relative z-10 drop-shadow-[0_8px_16px_rgba(37,99,235,0.2)]" />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="text-center mb-12"
        >
          <div className="text-brand-blue font-bold tracking-[0.2em] text-xs uppercase mb-4 opacity-90 drop-shadow-[0_0_8px_rgba(37,99,235,0.5)]">Next-Gen Mobility</div>
          <h1 className="text-5xl font-extrabold tracking-tight text-slate-900 mb-6">
            Kerala<span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-blue to-brand-indigo drop-shadow-sm">Connect</span>
          </h1>
          <p className="text-slate-500 font-medium text-lg max-w-[280px] mx-auto leading-relaxed">
            Realtime transit intelligence for the smartest commuters.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="w-full space-y-4"
        >
          <button
            onClick={onLogin}
            className="w-full py-4.5 rounded-[24px] bg-white border border-slate-200 text-slate-800 font-extrabold text-lg transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_8px_30px_rgba(149,157,165,0.15)] active:scale-[0.98] flex items-center justify-center gap-3"
          >
            <svg viewBox="0 0 24 24" className="w-6 h-6" aria-hidden="true">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            Continue with Google
          </button>
          
          <button
            onClick={() => setShowDriverLogin(true)}
            className="w-full py-4.5 rounded-[24px] bg-white border border-slate-100 text-slate-600 font-bold text-lg hover:bg-white hover:text-slate-900 transition-all duration-300 active:scale-[0.98] flex items-center justify-center gap-3 backdrop-blur-xl"
          >
            <Bus className="w-5 h-5 opacity-80" />
            Driver Portal Login
          </button>
        </motion.div>
      </div>

      {/* Decorative footer details */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 0.6 }}
        className="absolute bottom-10 flex gap-6 text-slate-400 text-xs font-bold uppercase tracking-widest"
      >
        <div className="flex items-center gap-2"><Bus className="w-4 h-4" /> Live Tracking</div>
        <div className="flex items-center gap-2 hidden sm:flex"><Ship className="w-4 h-4" /> Coastal Transit</div>
        <div className="flex items-center gap-2"><CloudRain className="w-4 h-4" /> Weather Aware</div>
      </motion.div>
    </div>
  );
}
