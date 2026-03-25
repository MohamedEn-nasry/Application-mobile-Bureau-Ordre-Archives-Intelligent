import { Signal, Wifi, Battery } from 'lucide-react';

interface StatusBarProps {
  light?: boolean;
}

export function StatusBar({ light = false }: StatusBarProps) {
  const textColor = light ? 'text-white' : 'text-slate-800';
  const iconColor = light ? '#ffffff' : '#1e293b';

  return (
    <div className={`h-8 flex items-center justify-between px-5 shrink-0 relative z-10 ${light ? 'bg-transparent' : 'bg-white'}`}>
      {/* Dynamic Island */}
      <div className="absolute left-1/2 -translate-x-1/2 top-1.5 w-[88px] h-[22px] bg-black rounded-full" />
      <span className={`text-xs font-semibold tracking-tight ${textColor}`}>12:00</span>
      <div className={`flex items-center gap-1 ${textColor}`}>
        <Signal size={13} color={iconColor} strokeWidth={2.5} />
        <Wifi size={13} color={iconColor} strokeWidth={2.5} />
        <Battery size={13} color={iconColor} strokeWidth={2.5} />
      </div>
    </div>
  );
}
