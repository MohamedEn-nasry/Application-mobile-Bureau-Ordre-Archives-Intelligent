import { useState } from 'react';
import { useNavigate } from 'react-router';
import { Camera, Pencil, Lock, LogOut, Shield, Bell, Globe, HelpCircle, ChevronRight, Check } from 'lucide-react';
import { StatusBar } from '../components/StatusBar';

const profileUrl = "https://images.unsplash.com/photo-1771050889377-b68415885c64?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjBtYW4lMjBvZmZpY2UlMjBwb3J0cmFpdHxlbnwxfHx8fDE3NzQzMTk3ODh8MA&ixlib=rb-4.1.0&q=80&w=400";

export function ProfileScreen() {
  const navigate = useNavigate();
  const [notifEnabled, setNotifEnabled] = useState(true);
  const [loggingOut, setLoggingOut] = useState(false);

  const handleLogout = () => {
    setLoggingOut(true);
    setTimeout(() => navigate('/'), 1000);
  };

  const settingsGroups = [
    {
      title: 'Account',
      items: [
        { icon: Pencil, label: 'Edit Profile', color: 'bg-indigo-100 text-indigo-600', action: () => {} },
        { icon: Lock, label: 'Change Password', color: 'bg-slate-100 text-slate-600', action: () => {} },
      ],
    },
    {
      title: 'Preferences',
      items: [
        {
          icon: Bell, label: 'Push Notifications', color: 'bg-amber-100 text-amber-600',
          toggle: notifEnabled, onToggle: () => setNotifEnabled(!notifEnabled),
        },
        { icon: Globe, label: 'Language: Français', color: 'bg-blue-100 text-blue-600', action: () => {} },
      ],
    },
    {
      title: 'Support',
      items: [
        { icon: HelpCircle, label: 'Help & Documentation', color: 'bg-purple-100 text-purple-600', action: () => {} },
        { icon: Shield, label: 'Security & Privacy', color: 'bg-emerald-100 text-emerald-600', action: () => {} },
      ],
    },
  ];

  return (
    <div className="flex flex-col h-full bg-slate-50">
      {/* Header */}
      <div style={{ background: 'linear-gradient(150deg, #1e1b4b 0%, #4338ca 100%)' }}>
        <StatusBar light />
        <div className="pb-8 pt-2">
          <div className="flex flex-col items-center">
            {/* Profile picture */}
            <div className="relative mb-3">
              <img
                src={profileUrl}
                alt="Profile"
                className="w-20 h-20 rounded-full object-cover border-4 border-white/30"
              />
              <button
                className="absolute bottom-0 right-0 w-7 h-7 rounded-full bg-indigo-500 flex items-center justify-center border-2 border-white"
              >
                <Camera size={13} color="white" />
              </button>
            </div>

            {/* Name & role */}
            <h2 className="text-white text-[20px] font-bold">Ahmed Benali</h2>
            <p className="text-white/70 text-[13px]">ahmed.benali@gov.ma</p>
            <div
              className="mt-2 flex items-center gap-1.5 px-3 py-1 rounded-full"
              style={{ background: 'rgba(255,255,255,0.15)' }}
            >
              <Shield size={12} color="rgba(255,255,255,0.9)" />
              <span className="text-[11px] font-bold text-white/90 tracking-wide uppercase">Agent</span>
            </div>
          </div>
        </div>
      </div>

      {/* Stats row */}
      <div className="mx-4 -mt-5 mb-4">
        <div
          className="bg-white rounded-2xl p-3 grid grid-cols-3 divide-x divide-slate-100"
          style={{ boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}
        >
          {[
            { label: 'Processed', value: '142' },
            { label: 'This Month', value: '23' },
            { label: 'Scans', value: '38' },
          ].map(({ label, value }) => (
            <div key={label} className="flex flex-col items-center px-2">
              <span className="text-[20px] font-bold text-slate-800">{value}</span>
              <span className="text-[10px] text-slate-400 font-medium">{label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Settings */}
      <div className="flex-1 overflow-y-auto px-4 pb-4 space-y-4">
        {settingsGroups.map(group => (
          <div key={group.title}>
            <p className="text-slate-400 text-[11px] font-bold uppercase tracking-wider px-1 mb-2">
              {group.title}
            </p>
            <div
              className="bg-white rounded-2xl overflow-hidden"
              style={{ boxShadow: '0 2px 10px rgba(0,0,0,0.05)' }}
            >
              {group.items.map((item: any, i) => (
                <button
                  key={item.label}
                  onClick={item.action}
                  className={`w-full flex items-center gap-3 px-4 py-3.5 text-left ${
                    i < group.items.length - 1 ? 'border-b border-slate-50' : ''
                  }`}
                >
                  <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${item.color}`}>
                    <item.icon size={16} />
                  </div>
                  <span className="flex-1 text-slate-700 text-[13px] font-medium">{item.label}</span>
                  {'toggle' in item ? (
                    <div
                      onClick={e => { e.stopPropagation(); item.onToggle(); }}
                      className={`w-10 h-5.5 rounded-full flex items-center px-0.5 transition-all cursor-pointer ${
                        item.toggle ? 'bg-indigo-500 justify-end' : 'bg-slate-200 justify-start'
                      }`}
                      style={{ height: '22px', width: '40px' }}
                    >
                      <div className="w-4.5 h-4.5 bg-white rounded-full shadow-sm" style={{ width: '18px', height: '18px' }} />
                    </div>
                  ) : (
                    <ChevronRight size={16} className="text-slate-300" />
                  )}
                </button>
              ))}
            </div>
          </div>
        ))}

        {/* Agent info card */}
        <div>
          <p className="text-slate-400 text-[11px] font-bold uppercase tracking-wider px-1 mb-2">
            Agent Information
          </p>
          <div
            className="bg-white rounded-2xl overflow-hidden"
            style={{ boxShadow: '0 2px 10px rgba(0,0,0,0.05)' }}
          >
            {[
              { label: 'Employee ID', value: 'AG-2024-017' },
              { label: 'Department', value: 'Administrative Services' },
              { label: 'Role', value: 'Agent Bureau d\'Ordre' },
              { label: 'Since', value: 'January 2024' },
            ].map(({ label, value }, i) => (
              <div key={label} className={`flex px-4 py-3 ${i < 3 ? 'border-b border-slate-50' : ''}`}>
                <span className="w-32 text-slate-400 text-[12px]">{label}</span>
                <span className="text-slate-700 text-[12px] font-semibold">{value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* App version */}
        <div className="text-center">
          <p className="text-slate-400 text-[11px]">Intelligent Bureau d'Ordre v2.1.0</p>
          <p className="text-slate-300 text-[10px] mt-0.5">Agent Portal · Build 2026.03</p>
        </div>

        {/* Logout */}
        <button
          onClick={handleLogout}
          disabled={loggingOut}
          className="w-full py-4 rounded-2xl text-red-600 text-[14px] font-bold flex items-center justify-center gap-2 bg-red-50 border border-red-100 transition-all"
        >
          {loggingOut ? (
            <div className="w-4 h-4 border-2 border-red-400 border-t-transparent rounded-full animate-spin" />
          ) : (
            <LogOut size={17} />
          )}
          {loggingOut ? 'Logging out...' : 'Log Out'}
        </button>

        <div className="h-2" />
      </div>
    </div>
  );
}
