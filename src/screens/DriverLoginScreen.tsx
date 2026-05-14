import React, { useState } from 'react';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../lib/firebase';
import { motion } from 'motion/react';
import { Bus, ArrowLeft, Loader2 } from 'lucide-react';

interface DriverLoginScreenProps {
  onBack: () => void;
}

export function DriverLoginScreen({ onBack }: DriverLoginScreenProps) {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (isLogin) {
        await signInWithEmailAndPassword(auth, email, password);
      } else {
        await createUserWithEmailAndPassword(auth, email, password);
      }
    } catch (err: any) {
      setError(err.message || "An error occurred");
      setLoading(false);
    }
  };

  return (
    <div className="relative flex flex-col items-center justify-center h-full bg-slate-50 overflow-hidden px-8 font-sans w-full">
      {/* Background cinematic elements */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-brand-blue/10 rounded-full blur-[100px] mix-blend-multiply translate-x-1/3 -translate-y-1/3" />
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-brand-blue/10 rounded-full blur-[100px] mix-blend-multiply -translate-x-1/3 translate-y-1/3" />
        <motion.div 
          animate={{ x: [0, -30, 0], y: [0, 15, 0] }}
          transition={{ repeat: Infinity, duration: 15, ease: "linear" }}
          className="absolute inset-0 opacity-[0.03] bg-[radial-gradient(circle_at_center,_#0f172a_1px,_transparent_1px)] bg-[length:32px_32px]"
        />
      </div>

      <button 
        onClick={onBack}
        className="absolute top-10 left-6 z-20 text-slate-500 hover:text-brand-blue flex items-center gap-2 p-3 rounded-full hover:bg-white transition-all duration-300"
      >
        <ArrowLeft className="w-6 h-6" />
      </button>

      <div className="relative z-10 w-full max-w-sm flex flex-col items-center">
        <motion.div 
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, type: "spring", bounce: 0.4 }}
          className="w-28 h-28 bg-white border border-slate-100 rounded-[36px] backdrop-blur-2xl flex items-center justify-center shadow-[0_20px_40px_rgba(149,157,165,0.2)] mb-10 relative overflow-hidden group"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-brand-indigo/20 to-brand-indigo/20 rounded-[32px]" />
          <div className="absolute inset-0 bg-brand-blue/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <Bus className="w-12 h-12 text-brand-blue relative z-10 drop-shadow-[0_0_15px_rgba(37,99,235,0.5)]" />
        </motion.div>

        <motion.div
           initial={{ opacity: 0, y: 20 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ duration: 0.8, delay: 0.1 }}
           className="text-center mb-10"
        >
          <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 mb-3 drop-shadow-sm">
            Operator <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-blue to-brand-indigo">Portal</span>
          </h1>
          <p className="text-slate-500 font-medium text-lg">
            {isLogin ? "Authenticate to commence trip duties" : "Register operator credentials"}
          </p>
        </motion.div>

        <motion.form 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          onSubmit={handleSubmit}
          className="w-full space-y-4"
        >
          {error && (
            <div className="bg-red-500/10 border border-red-500/30 text-red-400 p-4 rounded-[16px] text-sm backdrop-blur-xl">
              {error}
            </div>
          )}
          
          <input 
            type="email" 
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="Operator Key (Email)"
            className="w-full bg-white border border-slate-100 rounded-[20px] px-6 py-4.5 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-brand-blue/50 focus:bg-white transition-all font-mono text-sm"
            required
          />
          <input 
            type="password" 
            value={password}
            onChange={e => setPassword(e.target.value)}
            placeholder="Access Code"
            className="w-full bg-white border border-slate-100 rounded-[20px] px-6 py-4.5 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-brand-blue/50 focus:bg-white transition-all font-mono text-sm"
            required
          />
          
          <button 
            type="submit"
            disabled={loading}
            className="w-full mt-2 py-4.5 rounded-[24px] bg-brand-blue text-white font-extrabold text-lg transition-all duration-300 hover:scale-[1.02] hover:bg-brand-blue/90 hover:shadow-[0_8px_30px_rgba(37,99,235,0.3)] active:scale-[0.98] disabled:opacity-50 flex items-center justify-center disabled:hover:scale-100 disabled:hover:shadow-none"
          >
            {loading ? <Loader2 className="w-7 h-7 text-white animate-spin" /> : (isLogin ? "Initialize Trip" : "Request Authorization")}
          </button>
        </motion.form>

        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          onClick={() => setIsLogin(!isLogin)}
          className="mt-8 text-slate-400 hover:text-slate-900 transition-colors text-sm font-semibold tracking-wide"
        >
          {isLogin ? "Require operator access? Register" : "Existing operator? Authenticate"}
        </motion.button>
      </div>
    </div>
  );
}
