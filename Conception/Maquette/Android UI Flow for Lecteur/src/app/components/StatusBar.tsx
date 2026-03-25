import { Wifi, Battery, Signal } from 'lucide-react';

interface StatusBarProps {
  dark?: boolean;
}

export function StatusBar({ dark = false }: StatusBarProps) {
  const bg = dark ? 'bg-gray-950' : 'bg-indigo-800';
  return (
    <div
      className={`${bg} flex items-center justify-between px-5 shrink-0`}
      style={{ height: 28, paddingTop: 4 }}
    >
      <span className="text-white text-xs font-semibold" style={{ letterSpacing: 0.3 }}>
        10:30
      </span>
      <div className="flex items-center gap-1.5">
        <Signal size={11} className="text-white/80" />
        <Wifi size={11} className="text-white/80" />
        <Battery size={13} className="text-white/80" />
      </div>
    </div>
  );
}
