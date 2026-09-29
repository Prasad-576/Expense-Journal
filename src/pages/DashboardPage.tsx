import { useState } from 'react';
import { useExpenseStore } from '@/store/useExpenseStore';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { CATEGORIES, type Category } from '@/types';
import { format, parseISO, isToday, isYesterday } from 'date-fns';
import { ArrowDownRight } from 'lucide-react';

export default function DashboardPage() {
  const { expenses, settings, addExpense } = useExpenseStore();
  
  // Form State
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState<Category>('🍔 Food');
  const [title, setTitle] = useState('');
  const [date, setDate] = useState(format(new Date(), 'yyyy-MM-dd'));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount) return;

    addExpense({
      amount: Number(amount),
      title: title || 'No description',
      category,
      date: date,
      tags: [],
    });
    
    // Reset form
    setAmount('');
    setTitle('');
    setDate(format(new Date(), 'yyyy-MM-dd'));
  };

  const recentExpenses = expenses.slice(0, 10);

  const formatTxDate = (dateString: string) => {
    const date = parseISO(dateString);
    if (isToday(date)) return 'Today';
    if (isYesterday(date)) return 'Yesterday';
    return format(date, 'MMM dd, yyyy');
  };

  return (
    <div className="space-y-8 pb-32 max-w-lg mx-auto">
      
      {/* Top Header */}
      <div className="pt-0 pb-1">
        <h1 className="text-2xl font-extrabold tracking-tight">Add Expense</h1>
        <p className="text-[var(--text-muted)] font-medium mt-1">What did you spend on?</p>
      </div>

      {/* Main Add Expense Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        
        {/* Massive Amount Input - Glassmorphic */}
        <div className="glass-card p-6 rounded-[24px] flex flex-col items-center justify-center relative overflow-hidden">
          <div className="absolute top-0 right-0 -mt-10 -mr-10 w-32 h-32 bg-[var(--secondary)]/30 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 -mb-10 -ml-10 w-24 h-24 bg-[var(--primary)]/10 rounded-full blur-3xl" />
          
          <div className="relative z-10 flex items-center text-5xl font-extrabold text-[var(--text-color)] tracking-tight">
            <span className="text-3xl opacity-50 mr-2">{settings.currency}</span>
            <input
              type="number"
              min="0"
              step="0.01"
              required
              placeholder="0.00"
              className="w-40 bg-transparent text-center focus:outline-none placeholder:text-gray-300"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
          </div>
        </div>

        {/* Category Chips */}
        <div className="space-y-3">
          <label className="text-sm font-bold uppercase tracking-wider text-[var(--text-muted)] ml-2">Category</label>
          <div className="flex overflow-x-auto pb-4 -mx-4 px-4 gap-3 hide-scrollbar snap-x">
            {CATEGORIES.map(c => (
              <button
                key={c}
                type="button"
                onClick={() => setCategory(c)}
                className={`snap-center flex-shrink-0 px-4 py-2.5 rounded-[16px] text-[14px] font-bold transition-all duration-300 flex items-center shadow-sm backdrop-blur-md ${
                  category === c 
                    ? "bg-[var(--primary)] text-white border-[1.5px] border-white/50 shadow-[var(--shadow-float)] scale-[1.02]" 
                    : "bg-white/50 border-[1.5px] border-white text-[var(--text-muted)] hover:border-[var(--primary)]/30 hover:bg-[var(--secondary)]/10"
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        </div>

        {/* Date Field */}
        <div className="space-y-3">
          <label className="text-sm font-bold uppercase tracking-wider text-[var(--text-muted)] ml-2">Date</label>
          <Input 
            type="date"
            required
            max={format(new Date(), 'yyyy-MM-dd')}
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
        </div>

        {/* Description Field */}
        <div className="space-y-3">
          <label className="text-sm font-bold uppercase tracking-wider text-[var(--text-muted)] ml-2">Description (Optional)</label>
          <Input 
            placeholder="e.g. Pizza, Fuel, Books"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>

        {/* Submit Button */}
        <Button type="submit" size="lg" className="w-full">
          + Add Expense
        </Button>
      </form>

      {/* Recent Transactions Section */}
      <div className="pt-6 space-y-4">
        <h2 className="text-xl font-bold ml-2">Recent Transactions</h2>
        
        <Card className="bg-transparent shadow-none border-none p-0 overflow-visible">
          <div className="space-y-3">
            {recentExpenses.length > 0 ? (
              recentExpenses.map(expense => (
                <div key={expense.id} className="glass-card p-4 rounded-[20px] flex items-center justify-between hover:scale-[1.01] transition-transform cursor-pointer group">
                  <div className="flex items-center space-x-3.5">
                    <div className="w-11 h-11 rounded-[14px] bg-white/70 border-[1.5px] border-white text-xl flex items-center justify-center shadow-sm">
                      {expense.category.split(' ')[0]}
                    </div>
                    <div>
                      <p className="font-bold text-[15px] text-[var(--text-color)]">
                        {expense.title}
                      </p>
                      <p className="text-[12px] font-semibold text-[var(--text-muted)] mt-0.5 flex items-center space-x-1">
                        <span>{expense.category.split(' ').slice(1).join(' ')}</span>
                        <span>•</span>
                        <span>{formatTxDate(expense.date)}</span>
                      </p>
                    </div>
                  </div>
                  <div className="font-extrabold text-[17px] text-[var(--text-color)] flex items-center">
                    <ArrowDownRight size={16} className="text-[var(--danger)] mr-1 stroke-[3px]" />
                    {settings.currency}{expense.amount.toLocaleString()}
                  </div>
                </div>
              ))
            ) : (
              <div className="p-8 text-center text-[var(--text-muted)] font-medium glass-card rounded-[24px]">
                No recent transactions.
              </div>
            )}
          </div>
        </Card>
      </div>

    </div>
  );
}
