import { useState } from 'react';
import { useExpenseStore } from '@/store/useExpenseStore';
import type { Category } from '@/types';
import { CATEGORIES } from '@/data/mockData';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';
import { format } from 'date-fns';
import { IndianRupee, Tag } from 'lucide-react';
import { cn } from '@/utils/cn';

interface AddExpenseFormProps {
  onSuccess: () => void;
  onCancel: () => void;
}

export function AddExpenseForm({ onSuccess, onCancel }: AddExpenseFormProps) {
  const { addExpense, quickExpenses } = useExpenseStore();
  
  const [amount, setAmount] = useState('');
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<Category>('🍔 Food');
  const [date, setDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [tags, setTags] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || !title) return;

    addExpense({
      amount: Number(amount),
      title,
      category,
      date,
      tags: tags.split(',').map(t => t.trim()).filter(Boolean),
    });
    onSuccess();
  };

  const handleQuickAdd = (qe: typeof quickExpenses[0]) => {
    setAmount(qe.amount.toString());
    setTitle(qe.title);
    setCategory(qe.category);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      
      {/* Massive Amount Input */}
      <div className="flex flex-col items-center justify-center py-6">
        <Label className="sr-only" htmlFor="amount">Amount</Label>
        <div className="flex items-center text-5xl font-extrabold text-[var(--text-color)]">
          <span className="text-3xl opacity-60 mr-2"><IndianRupee size={32} /></span>
          <input
            id="amount"
            type="number"
            min="0"
            step="0.01"
            required
            placeholder="0"
            className="w-32 bg-transparent text-center focus:outline-none placeholder:text-gray-300"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
        </div>
      </div>

      {/* Quick Add Section */}
      {quickExpenses.length > 0 && (
        <div className="bg-[var(--background)] p-4 rounded-3xl border border-[var(--border-color)]/50">
          <Label className="mb-3 block text-xs font-bold uppercase tracking-wider text-[var(--text-muted)] ml-1">Quick Add</Label>
          <div className="flex flex-wrap gap-2">
            {quickExpenses.map((qe) => (
              <button
                key={qe.id}
                type="button"
                onClick={() => handleQuickAdd(qe)}
                className="flex items-center space-x-1.5 px-4 py-2 bg-white border border-[var(--border-color)] rounded-full text-sm font-semibold hover:border-[var(--primary)] hover:text-[var(--primary)] transition-all shadow-sm active:scale-95"
              >
                <span className="text-base">{qe.emoji}</span>
                <span>{qe.title}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="space-y-4 px-1">
        <div className="space-y-2">
          <Label htmlFor="title" className="text-xs font-bold uppercase tracking-wider text-[var(--text-muted)] ml-1">Title</Label>
          <Input 
            id="title" 
            required
            placeholder="What did you spend on?" 
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label className="text-xs font-bold uppercase tracking-wider text-[var(--text-muted)] ml-1">Category</Label>
          <div className="flex overflow-x-auto pb-2 -mx-1 px-1 gap-2 hide-scrollbar">
            {CATEGORIES.map(c => (
              <button
                key={c}
                type="button"
                onClick={() => setCategory(c)}
                className={cn(
                  "flex-shrink-0 px-5 py-2.5 rounded-full text-sm font-semibold transition-all duration-200 border-2",
                  category === c 
                    ? "bg-[var(--primary)] text-white border-[var(--primary)] shadow-[var(--shadow-float)]" 
                    : "bg-white border-[var(--border-color)] text-[var(--text-muted)] hover:border-gray-300"
                )}
              >
                {c}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="date" className="text-xs font-bold uppercase tracking-wider text-[var(--text-muted)] ml-1">Date</Label>
          <Input 
            id="date" 
            type="date"
            required
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="tags" className="text-xs font-bold uppercase tracking-wider text-[var(--text-muted)] ml-1">Tags (Optional)</Label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Tag size={18} className="text-[var(--text-muted)]" />
            </div>
            <Input 
              id="tags" 
              placeholder="e.g. Office, Lunch" 
              value={tags}
              className="pl-11"
              onChange={(e) => setTags(e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="pt-6 flex space-x-3 px-1">
        <Button type="button" variant="outline" size="lg" className="flex-1" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" size="lg" className="flex-1">
          Save Expense
        </Button>
      </div>
    </form>
  );
}
