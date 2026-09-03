import { useState, useMemo } from 'react';
import { useExpenseStore } from '@/store/useExpenseStore';
import { Input } from '@/components/ui/Input';
import { Search, ChevronDown, ChevronRight } from 'lucide-react';
import { format, parseISO, endOfMonth, differenceInDays, startOfMonth } from 'date-fns';

export default function ExpensesPage() {
  const { expenses, settings } = useExpenseStore();
  const [search, setSearch] = useState('');
  
  // Group expenses by Month (e.g., "August 2026")
  const groupedByMonth = useMemo(() => {
    const filtered = expenses.filter(exp => 
      exp.title.toLowerCase().includes(search.toLowerCase()) || 
      exp.category.toLowerCase().includes(search.toLowerCase())
    );

    const grouped = filtered.reduce((acc, exp) => {
      const monthKey = format(parseISO(exp.date), 'MMMM yyyy');
      if (!acc[monthKey]) acc[monthKey] = [];
      acc[monthKey].push(exp);
      return acc;
    }, {} as Record<string, typeof expenses>);

    return grouped;
  }, [expenses, search]);

  const sortedMonths = Object.keys(groupedByMonth).sort((a, b) => {
    return new Date(b).getTime() - new Date(a).getTime();
  });

  // Keep track of which month is expanded. Default to the most recent month if available.
  const [expandedMonth, setExpandedMonth] = useState<string | null>(sortedMonths[0] || null);

  const toggleMonth = (month: string) => {
    setExpandedMonth(prev => prev === month ? null : month);
  };

  // Helper to calculate monthly summary stats
  const getMonthlyStats = (monthExpenses: typeof expenses, monthKey: string) => {
    const totalSpend = monthExpenses.reduce((sum, e) => sum + e.amount, 0);
    const totalTx = monthExpenses.length;
    
    // Calculate highest category
    const categoryTotals = monthExpenses.reduce((acc, e) => {
      acc[e.category] = (acc[e.category] || 0) + e.amount;
      return acc;
    }, {} as Record<string, number>);
    
    let highestCategory = 'N/A';
    let maxCategorySpend = 0;
    for (const [cat, amt] of Object.entries(categoryTotals)) {
      if (amt > maxCategorySpend) {
        maxCategorySpend = amt;
        highestCategory = cat.split(' ').slice(1).join(' '); // Strip emoji for cleaner text
      }
    }

    // Average per day calculation
    const monthDate = new Date(monthKey);
    let daysPassed = differenceInDays(endOfMonth(monthDate), startOfMonth(monthDate)) + 1; // Default to full month
    
    // If it's the current month, only calculate average up to today
    const today = new Date();
    if (monthDate.getMonth() === today.getMonth() && monthDate.getFullYear() === today.getFullYear()) {
      daysPassed = today.getDate();
    }
    
    const avgPerDay = Math.round(totalSpend / Math.max(1, daysPassed));

    return { totalSpend, totalTx, highestCategory, avgPerDay };
  };

  return (
    <div className="space-y-6 pb-28 max-w-lg mx-auto">
      
      {/* Header */}
      <div className="pt-2">
        <h1 className="text-3xl font-extrabold tracking-tight">History</h1>
        <p className="text-[var(--text-muted)] font-medium mt-1">Review your past transactions.</p>
      </div>

      {/* Sticky Search Bar */}
      <div className="sticky top-0 z-20 bg-transparent py-2">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Search size={20} className="text-[var(--text-muted)]" />
          </div>
          <Input 
            placeholder="Search by title or category..." 
            className="pl-12"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* Month Accordions */}
      <div className="space-y-4 pt-2">
        {sortedMonths.length > 0 ? (
          sortedMonths.map(month => {
            const isExpanded = expandedMonth === month;
            const monthExpenses = groupedByMonth[month];
            const stats = getMonthlyStats(monthExpenses, month);

            return (
              <div key={month} className="glass-card rounded-[32px] overflow-hidden transition-all duration-300">
                
                {/* Accordion Header (Trigger) */}
                <button 
                  onClick={() => toggleMonth(month)}
                  className="w-full px-5 py-4 flex items-center justify-between hover:bg-white/40 transition-colors"
                >
                  <div className="flex items-center space-x-3">
                    <div className="text-[var(--primary)] bg-white/70 shadow-sm border border-white p-1.5 rounded-full">
                      {isExpanded ? <ChevronDown size={20} strokeWidth={2.5} /> : <ChevronRight size={20} strokeWidth={2.5} />}
                    </div>
                    <span className="font-bold text-lg text-[var(--text-color)]">{month}</span>
                  </div>
                  <div className="font-extrabold text-[19px] text-[var(--text-color)]">
                    {settings.currency}{stats.totalSpend.toLocaleString()}
                  </div>
                </button>

                {/* Expanded Content */}
                {isExpanded && (
                  <div className="px-5 pb-6 pt-2 animate-in slide-in-from-top-2 fade-in duration-200">
                    
                    {/* Monthly Summary Box */}
                    <div className="bg-white/40 border-[1.5px] border-white backdrop-blur-md rounded-[20px] p-4 mb-5 mt-2 grid grid-cols-2 gap-y-3 gap-x-2 shadow-sm">
                      <div>
                        <p className="text-[11px] font-bold uppercase tracking-wider text-[var(--text-muted)]">Transactions</p>
                        <p className="font-extrabold text-[var(--text-color)] text-lg mt-0.5">{stats.totalTx}</p>
                      </div>
                      <div>
                        <p className="text-[11px] font-bold uppercase tracking-wider text-[var(--text-muted)]">Daily Avg</p>
                        <p className="font-extrabold text-[var(--text-color)] text-lg mt-0.5">{settings.currency}{stats.avgPerDay.toLocaleString()}</p>
                      </div>
                      <div className="col-span-2 pt-3 border-t border-white/50">
                        <p className="text-[11px] font-bold uppercase tracking-wider text-[var(--text-muted)]">Top Category</p>
                        <p className="font-extrabold text-[var(--primary)] text-[16px] mt-0.5">{stats.highestCategory}</p>
                      </div>
                    </div>

                    {/* Transaction List */}
                    <div className="space-y-1.5">
                      {monthExpenses.map(expense => (
                        <div key={expense.id} className="p-3.5 bg-white/60 border-[1.5px] border-white backdrop-blur-md flex items-center justify-between rounded-[20px] hover:scale-[1.01] hover:bg-white/80 shadow-sm transition-all group cursor-pointer">
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 rounded-[16px] bg-white border border-white text-lg flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform">
                              {expense.category.split(' ')[0]}
                            </div>
                            <div>
                              <p className="font-bold text-[14px] text-[var(--text-color)]">
                                {expense.title}
                              </p>
                              <div className="flex items-center text-[12px] font-semibold text-[var(--text-muted)] mt-1 space-x-1.5">
                                <span className="bg-[var(--primary)]/10 text-[var(--primary)] px-2 py-0.5 rounded-md">
                                  {expense.category.split(' ').slice(1).join(' ')}
                                </span>
                                <span>•</span>
                                <span>{format(parseISO(expense.date), 'dd MMM')}</span>
                              </div>
                            </div>
                          </div>
                          <div className="font-extrabold text-[17px] text-[var(--text-color)] flex items-center">
                            {settings.currency}{expense.amount.toLocaleString()}
                          </div>
                        </div>
                      ))}
                    </div>

                  </div>
                )}
              </div>
            );
          })
        ) : (
          <div className="text-center py-16 glass-card rounded-[32px] mt-4">
            <div className="w-16 h-16 bg-white/70 border border-white rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-sm">
              <Search size={24} className="text-[var(--text-muted)]" />
            </div>
            <h3 className="text-lg font-bold text-[var(--text-color)]">No expenses found</h3>
            <p className="text-[var(--text-muted)] font-medium mt-1 text-sm">
              {search ? 'Try adjusting your search filters.' : 'No expenses recorded yet.'}
            </p>
          </div>
        )}
      </div>

    </div>
  );
}
