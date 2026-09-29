import { Outlet } from 'react-router-dom';
import Sidebar from '@/components/layout/Sidebar';
import BottomNav from '@/components/layout/BottomNav';
import { Bell } from 'lucide-react';
import { useAuthStore } from '@/store/useAuthStore';

export function MainLayout() {
  const { user } = useAuthStore();
  
  return (
    <div className="min-h-screen bg-[var(--background)] flex">
      {/* Sidebar for Desktop */}
      <Sidebar />

      <main className="flex-1 max-w-lg mx-auto w-full relative">
        
        {/* Premium Mobile Header */}
        <header className="md:hidden flex items-center justify-between px-5 pt-8 pb-3">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <img 
                src={user?.photoURL || `https://ui-avatars.com/api/?name=${user?.displayName || 'User'}`}
                alt="Profile" 
                className="w-11 h-11 rounded-full border-2 border-white shadow-[var(--shadow-soft)] object-cover"
              />
              <div className="absolute bottom-0 right-0 w-3 h-3 bg-[var(--success)] border-2 border-white rounded-full"></div>
            </div>
            <div>
              <h2 className="text-[20px] font-extrabold text-[var(--text-color)] tracking-tight">
                Hi, {user?.displayName ? user.displayName.split(' ')[0] : 'User'} <span className="inline-block animate-wave">👋</span>
              </h2>
              <p className="text-[13px] font-bold text-[var(--text-muted)] uppercase tracking-widest mt-0.5">
                Track. Manage. Save.
              </p>
            </div>
          </div>
          
          <button className="relative w-11 h-11 rounded-full glass-card flex items-center justify-center hover:scale-105 active:scale-95 transition-transform group">
            <Bell size={20} className="text-[var(--primary)] group-hover:fill-[var(--primary)]/10 transition-colors" />
            <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-[var(--primary)] rounded-full border-2 border-white"></span>
          </button>
        </header>

        <div className="px-4 md:px-8 pt-2 md:pt-6 pb-28">
          <Outlet />
        </div>
      </main>

      {/* Floating Bottom Nav for Mobile */}
      <BottomNav />
    </div>
  );
}
