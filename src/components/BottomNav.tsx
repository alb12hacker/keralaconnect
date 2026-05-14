import { Home, Map as MapIcon, Route, Heart, User } from 'lucide-react';
import { cn } from '../lib/utils';
import { motion } from 'motion/react';

interface BottomNavProps {
  activeTab: string;
  onChange: (tab: string) => void;
}

export function BottomNav({ activeTab, onChange }: BottomNavProps) {
  const tabs = [
    { id: 'home', icon: Home, label: 'Home' },
    { id: 'map', icon: MapIcon, label: 'Live Map' },
    { id: 'routes', icon: Route, label: 'Routes' },
    { id: 'saved', icon: Heart, label: 'Saved' },
    { id: 'profile', icon: User, label: 'Profile' },
  ];

  return (
    <div className="fixed bottom-4 left-4 right-4 sm:max-w-[400px] sm:mx-auto sm:bottom-6 h-[68px] bg-white/60 backdrop-blur-[40px] border border-white/60 shadow-[0_20px_40px_-12px_rgba(37,99,235,0.15),inset_0_1px_2px_rgba(255,255,255,0.9)] flex items-center justify-between px-1.5 z-50 rounded-[32px] overflow-hidden before:absolute before:inset-0 before:bg-gradient-to-br before:from-white/80 before:via-transparent before:to-white/30 before:pointer-events-none after:absolute after:inset-0 after:bg-gradient-to-tr after:from-brand-blue/10 after:via-transparent after:to-brand-cyan/10 after:pointer-events-none">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = activeTab === tab.id;
        
        return (
          <button
            key={tab.id}
            onClick={() => onChange(tab.id)}
            className="relative flex flex-col items-center justify-center flex-1 h-full group outline-none"
          >
            {isActive && (
              <motion.div
                layoutId="nav-bg"
                className="absolute inset-0 top-2 bottom-2 bg-gradient-to-br from-brand-blue/10 to-brand-cyan/10 rounded-[24px] border border-brand-blue/20"
                initial={false}
                transition={{ type: "spring", stiffness: 400, damping: 30 }}
              />
            )}
            
            {/* Soft background glow for active icon */}
            {isActive && (
              <motion.div
                layoutId="nav-glow"
                className="absolute inset-x-2 top-1/2 -translate-y-1/2 h-8 bg-brand-blue/20 blur-[12px] rounded-full"
                initial={false}
                transition={{ type: "spring", stiffness: 400, damping: 30 }}
              />
            )}

            <Icon 
              className={cn(
                "w-6 h-6 z-10 transition-all duration-400 ease-[cubic-bezier(0.34,1.56,0.64,1)]", 
                isActive 
                  ? "text-brand-blue -translate-y-1 scale-110 drop-shadow-[0_4px_12px_rgba(37,99,235,0.4)]" 
                  : "text-slate-400 group-hover:text-slate-600 group-hover:-translate-y-0.5 group-hover:scale-105"
              )} 
              strokeWidth={isActive ? 2.5 : 2}
            />
            
            <span 
              className={cn(
                "text-[10px] transform z-10 font-bold tracking-widest transition-all duration-400 uppercase",
                isActive 
                  ? "text-brand-blue opacity-100 translate-y-1" 
                  : "text-transparent opacity-0 translate-y-3 absolute bottom-2"
              )}
            >
              {tab.label}
            </span>
          </button>
        );
      })}
    </div>
  );
}
