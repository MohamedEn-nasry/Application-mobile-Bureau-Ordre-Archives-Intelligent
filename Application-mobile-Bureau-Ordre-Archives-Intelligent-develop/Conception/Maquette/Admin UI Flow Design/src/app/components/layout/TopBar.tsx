import { ArrowLeft, MoreVertical, Bell, Search, Menu } from 'lucide-react';
import { useNavigate } from 'react-router';

interface TopBarProps {
  title: string;
  subtitle?: string;
  showBack?: boolean;
  showMenu?: boolean;
  showNotification?: boolean;
  showSearch?: boolean;
  showMore?: boolean;
  onBack?: () => void;
  notifCount?: number;
  light?: boolean;
}

export function TopBar({
  title,
  subtitle,
  showBack = false,
  showMenu = false,
  showNotification = false,
  showSearch = false,
  showMore = false,
  onBack,
  notifCount = 0,
  light = false,
}: TopBarProps) {
  const navigate = useNavigate();
  const textClass = light ? 'text-white' : 'text-slate-800';
  const iconColor = light ? '#ffffff' : '#374151';
  const subTextClass = light ? 'text-blue-100' : 'text-slate-500';
  const bgClass = light ? 'bg-transparent' : 'bg-white border-b border-slate-100';

  const handleBack = () => {
    if (onBack) onBack();
    else navigate(-1);
  };

  return (
    <div className={`h-14 flex items-center px-4 shrink-0 ${bgClass}`}>
      <div className="flex items-center gap-3 flex-1 min-w-0">
        {showBack && (
          <button onClick={handleBack} className="shrink-0 w-8 h-8 flex items-center justify-center rounded-full hover:bg-slate-100 active:bg-slate-200">
            <ArrowLeft size={20} color={iconColor} strokeWidth={2.5} />
          </button>
        )}
        {showMenu && (
          <button className="shrink-0 w-8 h-8 flex items-center justify-center rounded-full hover:bg-slate-100">
            <Menu size={20} color={iconColor} strokeWidth={2} />
          </button>
        )}
        <div className="min-w-0">
          <h2 className={`text-sm font-semibold truncate leading-tight ${textClass}`}>{title}</h2>
          {subtitle && <p className={`text-xs truncate leading-tight ${subTextClass}`}>{subtitle}</p>}
        </div>
      </div>
      <div className="flex items-center gap-1 shrink-0">
        {showSearch && (
          <button className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-slate-100">
            <Search size={18} color={iconColor} strokeWidth={2} />
          </button>
        )}
        {showNotification && (
          <button className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-slate-100 relative">
            <Bell size={18} color={iconColor} strokeWidth={2} />
            {notifCount > 0 && (
              <span className="absolute top-1 right-1 w-3.5 h-3.5 bg-red-500 rounded-full text-white flex items-center justify-center" style={{ fontSize: '8px', fontWeight: 700 }}>
                {notifCount > 9 ? '9+' : notifCount}
              </span>
            )}
          </button>
        )}
        {showMore && (
          <button className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-slate-100">
            <MoreVertical size={18} color={iconColor} strokeWidth={2} />
          </button>
        )}
      </div>
    </div>
  );
}
