import { useState, useMemo } from 'react';
import { useExpenseStore } from '@/store/useExpenseStore';
import { ChevronDown, ChevronRight, Fuel } from 'lucide-react';
import { format, parseISO } from 'date-fns';

export default function PetrolPage() {
  const { expenses, settings } = useExpenseStore();
  
  // Filter and group petrol expenses
  const groupedPetrolExpenses = useMemo(() => {
    // Exact match for the petrol category
    const petrolExpenses = expenses.filter(exp => exp.category === '⛽ Petrol');

    const grouped = petrolExpenses.reduce((acc, exp) => {
      const monthKey = format(parseISO(exp.date), 'MMMM yyyy');
      if (!acc[monthKey]) acc[monthKey] = [];
      acc[monthKey].push(exp);
      return acc;
    }, {} as Record<string, typeof expenses>);

    return grouped;
  }, [expenses]);

  const sortedMonths = Object.keys(groupedPetrolExpenses).sort((a, b) => {
    return new Date(b).getTime() - new Date(a).getTime();
  });

  const [expandedMonth, setExpandedMonth] = useState<string | null>(sortedMonths[0] || null);

  const toggleMonth = (month: string) => {
    setExpandedMonth(prev => prev === month ? null : month);
  };

  const getMonthlyStats = (monthExpenses: typeof expenses) => {
    const totalSpend = monthExpenses.reduce((sum, e) => sum + e.amount, 0);
    const totalRefuels = monthExpenses.length;
    const avgCost = totalRefuels > 0 ? Math.round(totalSpend / totalRefuels) : 0;
    const highestRefuel = totalRefuels > 0 ? Math.max(...monthExpenses.map(e => e.amount)) : 0;

    return { totalSpend, totalRefuels, avgCost, highestRefuel };
  };

  return (
    <div className="space-y-6 pb-28 max-w-lg mx-auto">
      
      {/* Header */}
      <div className="pt-2">
        <h1 className="text-3xl font-extrabold tracking-tight">Petrol Tracker</h1>
        <p className="text-[var(--text-muted)] font-medium mt-1">Monitor your fuel consumption.</p>
      </div>

      {/* Month Accordions */}
      <div className="space-y-4 pt-2">
        {sortedMonths.length > 0 ? (
          sortedMonths.map(month => {
            const isExpanded = expandedMonth === month;
            const monthExpenses = groupedPetrolExpenses[month];
            const stats = getMonthlyStats(monthExpenses);

            return (
              <div key={month} className="glass-card rounded-[32px] overflow-hidden transition-all duration-300">
                
                {/* Accordion Header */}
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
                  <div className="text-right">
                    <div className="font-extrabold text-[19px] text-[var(--text-color)]">
                      {settings.currency}{stats.totalSpend.toLocaleString()}
                    </div>
                    <div className="text-[12px] font-semibold text-[var(--text-muted)] mt-0.5">
                      {stats.totalRefuels} Refuels
                    </div>
                  </div>
                </button>

                {/* Expanded Content */}
                {isExpanded && (
                  <div className="px-5 pb-6 pt-2 animate-in slide-in-from-top-2 fade-in duration-200">
                    
                    {/* Monthly Summary Box */}
                    <div className="bg-white/40 border-[1.5px] border-white backdrop-blur-md rounded-[20px] p-4 mb-5 mt-2 grid grid-cols-2 gap-y-3 gap-x-2 shadow-sm">
                      <div>
                        <p className="text-[11px] font-bold uppercase tracking-wider text-[var(--text-muted)]">Monthly Expense</p>
                        <p className="font-extrabold text-[var(--primary)] text-xl mt-1">{settings.currency}{stats.totalSpend.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-[11px] font-bold uppercase tracking-wider text-[var(--text-muted)]">Total Refuels</p>
                        <p className="font-extrabold text-[var(--text-color)] text-xl mt-1">{stats.totalRefuels} <span className="text-sm font-semibold text-[var(--text-muted)]">Times</span></p>
                      </div>
                      <div className="pt-3 border-t border-white/50">
                        <p className="text-[11px] font-bold uppercase tracking-wider text-[var(--text-muted)]">Avg Per Refuel</p>
                        <p className="font-extrabold text-[var(--text-color)] text-lg mt-0.5">{settings.currency}{stats.avgCost.toLocaleString()}</p>
                      </div>
                      <div className="pt-3 border-t border-white/50">
                        <p className="text-[11px] font-bold uppercase tracking-wider text-[var(--text-muted)]">Highest Refuel</p>
                        <p className="font-extrabold text-[var(--text-color)] text-lg mt-0.5">{settings.currency}{stats.highestRefuel.toLocaleString()}</p>
                      </div>
                    </div>

                    {/* Transaction List */}
                    <div className="space-y-1.5">
                      {monthExpenses.map(expense => (
                        <div key={expense.id} className="p-3.5 bg-white/60 border-[1.5px] border-white backdrop-blur-md flex items-center justify-between rounded-[20px] hover:scale-[1.01] hover:bg-white/80 shadow-sm transition-all group cursor-pointer">
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 rounded-[16px] bg-white border border-white text-[var(--primary)] flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform">
                              <Fuel size={18} strokeWidth={2.5} />
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
                                <span>{format(parseISO(expense.date), 'dd MMM yyyy')}</span>
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
              <Fuel size={24} className="text-[var(--text-muted)]" />
            </div>
            <h3 className="text-lg font-bold text-[var(--text-color)]">No petrol records found</h3>
            <p className="text-[var(--text-muted)] font-medium mt-1 text-sm">
              Start adding petrol expenses to track them here.
            </p>
          </div>
        )}
      </div>

    </div>
  );
}
