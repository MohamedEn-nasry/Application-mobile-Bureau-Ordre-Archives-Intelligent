import { useState } from 'react';
import { useNavigate } from 'react-router';
import { User, Mail, Lock, Phone, Shield, Eye, EyeOff, ChevronDown, CheckCircle2 } from 'lucide-react';
import { StatusBar } from '../layout/StatusBar';
import { TopBar } from '../layout/TopBar';

const roles = [
  { value: 'Admin', label: 'Administrateur', desc: 'Accès complet', color: 'bg-purple-100 text-purple-700' },
  { value: 'Agent', label: 'Agent', desc: 'Création et gestion du courrier', color: 'bg-blue-100 text-blue-700' },
  { value: 'Lecteur', label: 'Lecteur', desc: 'Consultation uniquement', color: 'bg-teal-100 text-teal-700' },
];

export function CreateUserScreen() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [showRoleDropdown, setShowRoleDropdown] = useState(false);
  const [isActive, setIsActive] = useState(true);
  const [success, setSuccess] = useState(false);
  const [form, setForm] = useState({
    fullName: '', username: '', email: '', password: '', confirmPassword: '', phone: '', role: 'Agent',
  });

  const handleCreate = () => {
    setSuccess(true);
    setTimeout(() => { navigate('/users'); }, 1500);
  };

  const selectedRole = roles.find((r) => r.value === form.role)!;

  const InputField = ({
    label, value, onChange, placeholder, type = 'text', icon: Icon, suffix
  }: {
    label: string; value: string; onChange: (v: string) => void;
    placeholder: string; type?: string; icon: typeof User; suffix?: React.ReactNode;
  }) => (
    <div className="mb-4">
      <label className="text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1.5 block">{label}</label>
      <div className="relative">
        <div className="absolute left-3 top-1/2 -translate-y-1/2">
          <Icon size={15} className="text-slate-400" />
        </div>
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-10 py-3 text-sm text-slate-800 placeholder-slate-400 outline-none focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100 transition-all"
        />
        {suffix}
      </div>
    </div>
  );

  if (success) {
    return (
      <div className="flex flex-col h-full bg-slate-50">
        <StatusBar />
        <div className="flex-1 flex flex-col items-center justify-center px-8">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-5">
            <CheckCircle2 size={40} className="text-green-600" />
          </div>
          <h2 className="text-lg font-bold text-slate-800 mb-2">Compte créé !</h2>
          <p className="text-sm text-slate-500 text-center">Le compte a été créé avec succès. L'utilisateur peut maintenant se connecter.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-slate-50">
      <StatusBar />
      <div className="bg-white shrink-0">
        <TopBar title="Créer un Utilisateur" showBack />
      </div>

      {/* Admin-only badge */}
      <div className="mx-4 mt-3 bg-blue-50 border border-blue-200 rounded-xl px-3.5 py-2.5 flex items-center gap-2 shrink-0">
        <Shield size={13} className="text-blue-600 shrink-0" />
        <p className="text-xs text-blue-700 font-medium">Réservé à l'administrateur — aucune inscription publique</p>
      </div>

      <div className="flex-1 overflow-y-auto px-4 pt-4 pb-4" style={{ scrollbarWidth: 'none' }}>
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100">

          <InputField
            label="Nom Complet"
            value={form.fullName}
            onChange={(v) => setForm({ ...form, fullName: v })}
            placeholder="Fatima Zohra Haddad"
            icon={User}
          />

          <InputField
            label="Nom d'utilisateur"
            value={form.username}
            onChange={(v) => setForm({ ...form, username: v })}
            placeholder="f.haddad"
            icon={User}
          />

          <InputField
            label="Adresse Email"
            value={form.email}
            onChange={(v) => setForm({ ...form, email: v })}
            placeholder="f.haddad@bureau.gov.dz"
            type="email"
            icon={Mail}
          />

          <InputField
            label="Mot de passe"
            value={form.password}
            onChange={(v) => setForm({ ...form, password: v })}
            placeholder="••••••••"
            type={showPassword ? 'text' : 'password'}
            icon={Lock}
            suffix={
              <button onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">
                {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            }
          />

          <InputField
            label="Confirmer le mot de passe"
            value={form.confirmPassword}
            onChange={(v) => setForm({ ...form, confirmPassword: v })}
            placeholder="••••••••"
            type={showConfirm ? 'text' : 'password'}
            icon={Lock}
            suffix={
              <button onClick={() => setShowConfirm(!showConfirm)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">
                {showConfirm ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            }
          />

          <InputField
            label="Téléphone (optionnel)"
            value={form.phone}
            onChange={(v) => setForm({ ...form, phone: v })}
            placeholder="+213 21 XX XX XX"
            type="tel"
            icon={Phone}
          />

          {/* Role selector */}
          <div className="mb-4">
            <label className="text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1.5 block">Rôle</label>
            <div className="relative">
              <button
                onClick={() => setShowRoleDropdown(!showRoleDropdown)}
                className="w-full flex items-center justify-between bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-3"
              >
                <div className="flex items-center gap-2">
                  <Shield size={15} className="text-slate-400" />
                  <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${selectedRole.color}`}>{selectedRole.label}</span>
                  <span className="text-xs text-slate-500">{selectedRole.desc}</span>
                </div>
                <ChevronDown size={14} className="text-slate-400" />
              </button>
              {showRoleDropdown && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-slate-200 rounded-xl shadow-xl z-10 overflow-hidden">
                  {roles.map((role) => (
                    <button
                      key={role.value}
                      onClick={() => { setForm({ ...form, role: role.value }); setShowRoleDropdown(false); }}
                      className="w-full text-left flex items-center gap-3 px-4 py-3 hover:bg-slate-50 border-b border-slate-50 last:border-0"
                    >
                      {form.role === role.value && <CheckCircle2 size={14} className="text-blue-600 shrink-0" />}
                      <div className="flex-1">
                        <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${role.color}`}>{role.label}</span>
                        <p className="text-xs text-slate-400 mt-0.5">{role.desc}</p>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Account status toggle */}
          <div className="flex items-center justify-between py-3 border-t border-slate-100">
            <div>
              <p className="text-sm font-semibold text-slate-800">Compte actif</p>
              <p className="text-xs text-slate-500">L'utilisateur peut se connecter immédiatement</p>
            </div>
            <button
              onClick={() => setIsActive(!isActive)}
              className={`relative w-12 h-6 rounded-full transition-colors ${isActive ? 'bg-blue-600' : 'bg-slate-300'}`}
            >
              <div className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${isActive ? 'translate-x-6' : 'translate-x-0'}`} />
            </button>
          </div>
        </div>

        {/* Create button */}
        <button
          onClick={handleCreate}
          className="mt-4 w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-2xl py-3.5 text-sm font-bold shadow-lg shadow-blue-200 active:scale-95 transition-transform"
        >
          Créer le compte
        </button>

        <button
          onClick={() => navigate('/users')}
          className="mt-2.5 w-full border border-slate-200 text-slate-600 rounded-2xl py-3 text-sm font-medium active:scale-95 transition-transform"
        >
          Annuler
        </button>
      </div>
    </div>
  );
}
