import { useState } from 'react';
import { useNavigate } from 'react-router';
import { Eye, EyeOff, Lock, User, Shield } from 'lucide-react';
import { StatusBar } from '../layout/StatusBar';

export function LoginScreen() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [username, setUsername] = useState('admin.ahmed');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogin = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      navigate('/dashboard');
    }, 1200);
  };

  return (
    <div className="flex flex-col h-full bg-slate-50 overflow-y-auto">
      <StatusBar light />

      {/* Premium Header */}
      <div className="relative bg-gradient-to-br from-indigo-700 via-indigo-600 to-indigo-800 pt-6 pb-14 px-6 overflow-hidden shrink-0">
        {/* Decorative elements */}
        <div className="absolute top-[-10%] right-[-10%] w-64 h-64 rounded-full bg-white/5 blur-3xl" />
        <div className="absolute bottom-[-20%] left-[-10%] w-48 h-48 rounded-full bg-indigo-400/10 blur-2xl" />
        
        {/* Logo Section */}
        <div className="relative z-10 flex flex-col items-center text-center">
          <div className="w-20 h-20 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center mb-5 border border-white/20 shadow-2xl">
            <div className="w-14 h-14 bg-white rounded-xl flex items-center justify-center shadow-inner">
              <Shield size={32} className="text-indigo-600" />
            </div>
          </div>
          
          <p className="text-indigo-200 text-[10px] font-bold tracking-[0.2em] uppercase mb-1">Intelligent</p>
          <h1 className="text-white text-2xl font-black tracking-tight leading-none mb-2">
            Bureau d'Ordre
          </h1>
          <div className="px-3 py-1 bg-white/15 backdrop-blur-sm rounded-full border border-white/10">
            <span className="text-white text-[10px] font-bold tracking-widest uppercase">Admin Portal</span>
          </div>
        </div>
      </div>

      {/* Login Card */}
      <div className="flex-1 -mt-8 bg-white rounded-t-[40px] px-8 pt-10 pb-8 shadow-2xl relative z-20">
        <div className="mb-8">
          <h2 className="text-gray-900 text-2xl font-bold mb-1.5">Bienvenue</h2>
          <p className="text-gray-500 text-sm">Identifiez-vous pour gérer le courrier</p>
        </div>

        {/* Username */}
        <div className="mb-5">
          <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-2 block ml-1">
            Identifiant
          </label>
          <div className="relative group">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-indigo-500 transition-colors">
              <User size={18} />
            </div>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="votre.nom"
              className="w-full bg-gray-50 border border-gray-100 rounded-2xl pl-12 pr-4 py-4 text-[15px] text-gray-800 outline-none focus:bg-white focus:ring-4 focus:ring-indigo-500/5 focus:border-indigo-500 transition-all shadow-sm"
            />
          </div>
        </div>

        {/* Password */}
        <div className="mb-4">
          <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-2 block ml-1">
            Mot de passe
          </label>
          <div className="relative group">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-indigo-500 transition-colors">
              <Lock size={18} />
            </div>
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full bg-gray-50 border border-gray-100 rounded-2xl pl-12 pr-12 py-4 text-[15px] text-gray-800 outline-none focus:bg-white focus:ring-4 focus:ring-indigo-500/5 focus:border-indigo-500 transition-all shadow-sm"
            />
            <button
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-indigo-500 transition-colors"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>

        {/* Options */}
        <div className="flex items-center justify-between mb-8 px-1">
          <label className="flex items-center gap-2.5 cursor-pointer group">
            <div
              onClick={() => setRememberMe(!rememberMe)}
              className={`w-5 h-5 rounded-lg border-2 flex items-center justify-center transition-all ${
                rememberMe ? 'bg-indigo-600 border-indigo-600 shadow-lg shadow-indigo-200' : 'border-gray-200 bg-white group-hover:border-indigo-300'
              }`}
            >
              {rememberMe && <div className="w-2.5 h-1.5 border-l-2 border-b-2 border-white -rotate-45 mb-1" />}
            </div>
            <span className="text-[13px] text-gray-600 font-medium">Se souvenir</span>
          </label>
          <button className="text-[13px] text-indigo-600 font-bold hover:underline">Oublié ?</button>
        </div>

        {/* Login Action */}
        <button
          onClick={handleLogin}
          disabled={loading}
          className="w-full bg-gradient-to-r from-indigo-600 to-indigo-700 text-white rounded-2xl py-4 text-[15px] font-bold shadow-xl shadow-indigo-200 active:scale-[0.97] transition-all disabled:opacity-70 flex items-center justify-center gap-3 relative overflow-hidden"
        >
          {loading ? (
            <>
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              <span>Connexion en cours...</span>
            </>
          ) : (
            'Se connecter'
          )}
        </button>

        {/* Security Info */}
        <div className="mt-8 p-4 bg-indigo-50/50 rounded-2xl border border-indigo-100/50 flex items-start gap-3">
          <div className="w-8 h-8 rounded-xl bg-white flex items-center justify-center shrink-0 shadow-sm">
            <Shield size={16} className="text-indigo-500" />
          </div>
          <p className="text-[11px] text-indigo-700 leading-relaxed font-medium">
            Accès sécurisé réservé au personnel. Les tentatives d'accès non autorisées sont enregistrées.
          </p>
        </div>

        <p className="text-center text-[10px] text-gray-400 mt-8 font-medium">
          INTELLECTUAL BUREAU D'ORDRE v2.4.1<br />
          © 2026 DIRECTION GÉNÉRALE
        </p>
      </div>
    </div>
  );
}
