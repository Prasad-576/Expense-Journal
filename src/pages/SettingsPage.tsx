import { useExpenseStore } from '@/store/useExpenseStore';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Download, FileText, ShieldAlert, Globe, Moon, Sun } from 'lucide-react';
import { useState } from 'react';

const CURRENCIES = [
  { code: 'INR', symbol: '₹', name: 'Indian Rupee' },
  { code: 'USD', symbol: '$', name: 'US Dollar' },
  { code: 'EUR', symbol: '€', name: 'Euro' },
  { code: 'GBP', symbol: '£', name: 'British Pound' },
];

export default function SettingsPage() {
  const { settings, updateSettings } = useExpenseStore();
  const [currency, setCurrency] = useState(settings.currency);
  const [theme, setTheme] = useState('light');

  const handleSave = () => {
    updateSettings({ currency });
    alert('Settings saved successfully!');
  };

  return (
    <div className="space-y-8 pb-32">
      <div className="flex items-center justify-between mt-2">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight">Settings</h1>
          <p className="text-[var(--text-muted)] font-medium mt-1">Manage your app preferences.</p>
        </div>
      </div>

      <div className="space-y-6">
        
        {/* Profile Card */}
        <div className="glass-card p-5 rounded-[24px] flex items-center space-x-4">
          <img 
            src="https://i.pravatar.cc/150?img=11" 
            alt="Profile" 
            className="w-14 h-14 rounded-full border-[3px] border-white shadow-sm object-cover"
          />
          <div>
            <h2 className="text-xl font-extrabold text-[var(--text-color)]">Prasad</h2>
            <p className="text-sm font-semibold text-[var(--text-muted)] mt-0.5">Pro Member</p>
          </div>
        </div>

        {/* Currency Setting */}
        <div className="glass-card p-5 rounded-[24px]">
          <div className="flex items-center space-x-3 mb-4">
            <div className="bg-[var(--primary)]/10 text-[var(--primary)] p-2 rounded-xl">
              <Globe size={20} strokeWidth={2.5} />
            </div>
            <h3 className="font-bold text-lg text-[var(--text-color)]">Currency</h3>
          </div>
          <p className="text-[14px] font-medium text-[var(--text-muted)] mb-4">Select your primary currency for tracking expenses.</p>
          
          <select 
            value={currency}
            onChange={(e) => setCurrency(e.target.value)}
            className="w-full bg-white/70 border-[1.5px] border-white text-[var(--text-color)] font-bold rounded-2xl px-4 py-4 outline-none focus:ring-4 focus:ring-[var(--primary)]/20 shadow-sm appearance-none"
          >
            {CURRENCIES.map(c => (
              <option key={c.code} value={c.symbol}>
                {c.code} ({c.symbol}) - {c.name}
              </option>
            ))}
          </select>
        </div>

        {/* Theme Setting */}
        <div className="glass-card p-5 rounded-[24px]">
          <div className="flex items-center space-x-3 mb-4">
            <div className="bg-[var(--primary)]/10 text-[var(--primary)] p-2 rounded-xl">
              <Moon size={20} strokeWidth={2.5} />
            </div>
            <h3 className="font-bold text-lg text-[var(--text-color)]">Theme</h3>
          </div>
          <p className="text-[14px] font-medium text-[var(--text-muted)] mb-4">Choose your preferred visual style.</p>
          
          <div className="flex bg-white/50 p-1.5 rounded-2xl">
            <button 
              onClick={() => setTheme('light')}
              className={`flex-1 flex items-center justify-center space-x-2 py-3 rounded-xl font-bold transition-all ${theme === 'light' ? 'bg-white shadow-sm text-[var(--primary)] border-[1.5px] border-white' : 'text-[var(--text-muted)] hover:text-[var(--text-color)]'}`}
            >
              <Sun size={18} />
              <span>Light</span>
            </button>
            <button 
              className={`flex-1 flex items-center justify-center space-x-2 py-3 rounded-xl font-bold transition-all opacity-50 cursor-not-allowed text-[var(--text-muted)]`}
              disabled
            >
              <Moon size={18} />
              <span>Dark (Pro)</span>
            </button>
          </div>
        </div>

        {/* Save Button */}
        <Button onClick={handleSave} size="lg" className="w-full">
          Save Changes
        </Button>
      </div>

      <div className="space-y-4">
        <h2 className="text-xl font-bold flex items-center gap-2 text-[var(--text-color)]">
          <Download size={24} className="text-[var(--primary)]" />
          Data & Export
        </h2>
        
        <Card className="glass-card border-none">
          <CardContent className="p-5 space-y-4">
            <Button variant="outline" size="lg" className="w-full justify-start" onClick={() => alert('Exporting to CSV...')}>
              <Download size={20} className="mr-3 text-[var(--text-muted)]" />
              <span className="font-bold">Export as CSV</span>
            </Button>
            <Button variant="outline" size="lg" className="w-full justify-start" onClick={() => alert('Exporting to PDF...')}>
              <FileText size={20} className="mr-3 text-[var(--text-muted)]" />
              <span className="font-bold">Export as PDF</span>
            </Button>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-4 pt-4">
        <h2 className="text-xl font-bold text-[var(--danger)] flex items-center gap-2">
          <ShieldAlert size={24} />
          Danger Zone
        </h2>
        <Card className="glass-card border-[var(--danger)]/30 bg-red-50/50 rounded-[24px]">
          <CardContent className="p-5">
            <p className="text-sm font-medium text-[var(--danger)]/80 mb-5 leading-relaxed">
              Permanently delete all your expense data. This action cannot be undone and will wipe your local storage completely.
            </p>
            <Button variant="danger" size="lg" className="w-full">
              Wipe All Data
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
