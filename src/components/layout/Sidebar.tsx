import { NavLink } from 'react-router-dom';
import { Home, PieChart, Fuel, Settings, ListPlus, Wallet } from 'lucide-react';
import { cn } from '@/utils/cn';
import { useAuthStore } from '@/store/useAuthStore';

const NAV_ITEMS = [
  { icon: Home, label: 'Expenses', path: '/' },
  { icon: ListPlus, label: 'History', path: '/expenses' },
  { icon: PieChart, label: 'Analytics', path: '/analytics' },
  { icon: Fuel, label: 'Petrol', path: '/petrol' },
  { icon: Settings, label: 'Settings', path: '/settings' },
];

export default function Sidebar() {
  const { user } = useAuthStore();
  
  return (
    <aside className="hidden md:flex w-64 flex-col h-screen sticky top-0 bg-white/80 backdrop-blur-xl border-r border-white shadow-[var(--shadow-soft)] z-40 p-5">
      
      {/* Premium Desktop Header */}
      <div className="flex items-center space-x-3 mb-10">
        <div className="w-10 h-10 bg-gradient-to-br from-[var(--primary)] to-[var(--secondary)] rounded-xl flex items-center justify-center text-white shadow-lg">
          <Wallet size={20} strokeWidth={2.5} />
        </div>
        <div>
          <h1 className="text-lg font-extrabold text-[var(--text-color)] tracking-tight">FinTrack</h1>
          <p className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-widest mt-0.5">Premium</p>
        </div>
      </div>

      <nav className="flex-1 space-y-1.5">
        {NAV_ITEMS.map(({ icon: Icon, label, path }) => (
          <NavLink
            key={path}
            to={path}
            className={({ isActive }) =>
              cn(
                'flex items-center space-x-3 px-4 py-3 rounded-[16px] font-bold transition-all duration-300 group',
                isActive 
                  ? 'bg-[var(--primary)] text-white shadow-[var(--shadow-float)] scale-[1.02]' 
                  : 'text-[var(--text-muted)] hover:bg-[var(--secondary)]/10 hover:text-[var(--primary)] hover:scale-[1.02]'
              )
            }
          >
            {({ isActive }) => (
              <>
                <Icon size={20} strokeWidth={isActive ? 2.5 : 2} className={cn("transition-transform duration-300", isActive ? "" : "group-hover:rotate-6")} />
                <span className="text-[14px]">{label}</span>
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Desktop Profile Card */}
      <div className="mt-auto glass-card rounded-[20px] p-3 flex items-center space-x-3 cursor-pointer hover:scale-[1.02] transition-transform">
        <img 
          src={user?.photoURL || `https://ui-avatars.com/api/?name=${user?.displayName || 'User'}`} 
          alt="Profile" 
          className="w-9 h-9 rounded-full border-[1.5px] border-white object-cover shadow-sm"
        />
        <div className="overflow-hidden">
          <h3 className="font-bold text-[13px] text-[var(--text-color)] truncate">{user?.displayName || 'User'}</h3>
          <p className="text-[10px] font-semibold text-[var(--text-muted)] truncate">{user?.email || 'Logged out'}</p>
        </div>
      </div>
    </aside>
  );
}
