import { Signal, Wifi, Battery } from 'lucide-react';

interface StatusBarProps {
  light?: boolean;
}

export function StatusBar({ light = false }: StatusBarProps) {
  const textColor = light ? 'text-white' : 'text-slate-800';
  const iconColor = light ? 'text-white' : 'text-slate-700';

  return (
    <div className={`flex items-center justify-between px-5 pt-1 pb-1 ${textColor} relative z-10`} style={{ height: '36px' }}>
      <span className="text-[13px] font-semibold tracking-tight">09:41</span>
      {/* Dynamic island spacer */}
      <div className="w-24" />
      <div className={`flex items-center gap-1.5 ${iconColor}`}>
        <Signal size={13} strokeWidth={2.5} />
        <Wifi size={13} strokeWidth={2.5} />
        <Battery size={15} strokeWidth={2.5} />
      </div>
    </div>
  );
}
