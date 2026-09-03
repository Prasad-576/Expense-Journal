import { NavLink } from 'react-router-dom';
import { Home, PieChart, Fuel, Settings, ListPlus } from 'lucide-react';
import { cn } from '@/utils/cn';

const NAV_ITEMS = [
  { icon: Home, label: 'Expenses', path: '/' },
  { icon: ListPlus, label: 'History', path: '/expenses' },
  { icon: PieChart, label: 'Analytics', path: '/analytics' },
  { icon: Fuel, label: 'Petrol', path: '/petrol' },
  { icon: Settings, label: 'Settings', path: '/settings' },
];

export default function BottomNav() {
  return (
    <nav className="md:hidden fixed bottom-4 left-3 right-3 z-50 pointer-events-none">
      <div className="glass-card rounded-[28px] mx-auto max-w-[400px] pointer-events-auto p-1.5">
        <ul className="flex items-center justify-between">
          {NAV_ITEMS.map(({ icon: Icon, path }) => (
            <li key={path} className="flex-1 flex justify-center">
              <NavLink
                to={path}
                className={({ isActive }) =>
                  cn(
                    'flex flex-col items-center justify-center w-12 h-12 rounded-[20px] transition-all duration-300 relative group overflow-hidden',
                    isActive 
                      ? 'bg-[var(--primary)] text-white shadow-[var(--shadow-float)] scale-105' 
                      : 'text-[var(--text-muted)] hover:text-[var(--primary)] hover:bg-[var(--secondary)]/10'
                  )
                }
              >
                {({ isActive }) => (
                  <>
                    <Icon 
                      size={22} 
                      strokeWidth={isActive ? 2.5 : 2} 
                      className={cn("relative z-10 transition-transform duration-300", isActive ? "scale-110" : "group-hover:scale-110")} 
                    />
                    {isActive && (
                      <div className="absolute inset-0 bg-gradient-to-tr from-white/20 to-transparent opacity-50 rounded-[20px]" />
                    )}
                  </>
                )}
              </NavLink>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}
