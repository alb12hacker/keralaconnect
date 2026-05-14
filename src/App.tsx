import { useState, useEffect } from 'react';
import { BottomNav } from './components/BottomNav';
import { Home } from './screens/Home';
import { LiveMapScreen } from './screens/LiveMapScreen';
import { RoutesScreen } from './screens/RoutesScreen';
import { SavedScreen } from './screens/SavedScreen';
import { ProfileScreen } from './screens/ProfileScreen';
import { LoginScreen } from './screens/LoginScreen';
import { GoogleAuthProvider, signInWithPopup, onAuthStateChanged, User } from 'firebase/auth';
import { auth } from './lib/firebase';
import { motion, AnimatePresence } from 'motion/react';
import { Loader2 } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState('home');
  const [isAuthReady, setIsAuthReady] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      if (u) {
        setUser(u);
        setIsAuthReady(true);
      } else {
        setUser(null);
        setIsAuthReady(true);
      }
    });

    return () => unsub();
  }, []);

  const handleLogin = async () => {
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  if (!isAuthReady) {
    return (
      <div className="bg-[#f8fafc] w-full h-full text-[#0f172a] relative overflow-hidden flex flex-col font-sans sm:max-w-[420px] sm:mx-auto sm:border-x sm:border-slate-200 sm:shadow-2xl">
        <div className="flex bg-slate-50 h-full w-full items-center justify-center">
           <Loader2 className="w-10 h-10 animate-spin text-brand-blue" />
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="bg-[#f8fafc] w-full h-full text-[#0f172a] relative overflow-hidden flex flex-col font-sans sm:max-w-[420px] sm:mx-auto sm:border-x sm:border-slate-200 sm:shadow-2xl">
        <LoginScreen onLogin={handleLogin} />
      </div>
    );
  }

  return (
    <div className="bg-[#f8fafc] w-full h-full text-[#0f172a] relative overflow-hidden flex flex-col font-sans sm:max-w-[420px] sm:mx-auto sm:border-x sm:border-slate-200 sm:shadow-2xl">
      {/* Premium ambient glows */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-brand-coral/10 rounded-full blur-[100px] pointer-events-none opacity-60 mix-blend-multiply" />
      <div className="absolute bottom-1/4 right-0 w-[400px] h-[400px] bg-brand-sky/10 rounded-full blur-[100px] pointer-events-none opacity-50 mix-blend-multiply" />
      <div className="absolute top-1/2 left-0 w-[300px] h-[300px] bg-brand-peach/10 rounded-full blur-[100px] pointer-events-none opacity-50 mix-blend-multiply" />
      
      <div className="flex-1 overflow-hidden relative z-10">
        <AnimatePresence mode="wait">
          {activeTab === 'home' && (
            <motion.div key="home" className="absolute inset-0" initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 1.02 }} transition={{ duration: 0.2 }}>
              <Home onNavigate={setActiveTab} />
            </motion.div>
          )}
          {activeTab === 'map' && (
            <motion.div key="map" className="absolute inset-0" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>
              <LiveMapScreen />
            </motion.div>
          )}
          {activeTab === 'routes' && (
            <motion.div key="routes" className="absolute inset-0" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.2 }}>
              <RoutesScreen onNavigate={setActiveTab} />
            </motion.div>
          )}
          {activeTab === 'saved' && (
            <motion.div key="saved" className="absolute inset-0" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.2 }}>
              <SavedScreen />
            </motion.div>
          )}
          {activeTab === 'profile' && (
            <motion.div key="profile" className="absolute inset-0" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.2 }}>
              <ProfileScreen user={user} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      <BottomNav activeTab={activeTab} onChange={setActiveTab} />
    </div>
  );
}
