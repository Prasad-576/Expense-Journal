import { useExpenseStore } from '@/store/useExpenseStore';
import { Card, CardContent } from '@/components/ui/Card';
import { AreaChart, Area, XAxis, Tooltip, ResponsiveContainer, Cell, PieChart, Pie, Legend } from 'recharts';
import { format, parseISO, startOfWeek, addDays, isSameDay, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isToday } from 'date-fns';
import { useMemo, useState } from 'react';
import { CATEGORIES } from '@/types';
import { Lightbulb, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { cn } from '@/utils/cn';

const COLORS = ['#2A6F5B', '#D1E8E2', '#E07A5F', '#F4A261', '#E7E5E4', '#78716C', '#1C1C1E', '#BBE0D7'];

export default function AnalyticsPage() {
  const { expenses, settings } = useExpenseStore();
  const [view, setView] = useState<'weekly' | 'monthly'>('weekly');
  const [currentDate, setCurrentDate] = useState(new Date());

  const weeklyData = useMemo(() => {
    const today = new Date();
    const start = startOfWeek(today, { weekStartsOn: 1 });
    return Array.from({ length: 7 }).map((_, i) => {
      const date = addDays(start, i);
      const dayExpenses = expenses.filter(e => isSameDay(parseISO(e.date), date));
      const total = dayExpenses.reduce((sum, e) => sum + e.amount, 0);
      return {
        name: format(date, 'EEE'),
        amount: total,
      };
    });
  }, [expenses]);

  const categoryData = useMemo(() => {
    return CATEGORIES.map((category, index) => {
      const categoryExpenses = expenses.filter(e => e.category === category);
      const total = categoryExpenses.reduce((sum, e) => sum + e.amount, 0);
      return {
        name: category,
        value: total,
        color: COLORS[index % COLORS.length]
      };
    }).filter(data => data.value > 0).sort((a, b) => b.value - a.value);
  }, [expenses]);

  const totalSpent = useMemo(() => {
    return weeklyData.reduce((sum, data) => sum + data.amount, 0);
  }, [weeklyData]);

  // Calendar Logic
  const firstDay = startOfMonth(currentDate);
  const lastDay = endOfMonth(currentDate);
  const daysInMonth = eachDayOfInterval({ start: firstDay, end: lastDay });
  const startingDayIndex = firstDay.getDay(); 
  const emptyDays = Array.from({ length: startingDayIndex === 0 ? 6 : startingDayIndex - 1 });

  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  return (
    <div className="space-y-8 pb-32">
      <div className="flex items-center justify-between mt-2">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight">Analytics</h1>
          <p className="text-[var(--text-muted)] font-medium mt-1">Visualize your spending patterns.</p>
        </div>
      </div>
      
      <div className="flex glass-card p-1.5 rounded-2xl max-w-sm mx-auto">
        <button 
          onClick={() => setView('weekly')}
          className={cn('flex-1 px-4 py-2 text-sm font-bold rounded-xl transition-all duration-300', view === 'weekly' ? 'bg-white shadow-[var(--shadow-soft)] text-[var(--text-color)]' : 'text-[var(--text-muted)] hover:text-[var(--text-color)]')}
        >
          Weekly
        </button>
        <button 
          onClick={() => setView('monthly')}
          className={cn('flex-1 px-4 py-2 text-sm font-bold rounded-xl transition-all duration-300', view === 'monthly' ? 'bg-white shadow-[var(--shadow-soft)] text-[var(--text-color)]' : 'text-[var(--text-muted)] hover:text-[var(--text-color)]')}
        >
          Monthly
        </button>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Card className="glass-card bg-[var(--primary)] border-none">
          <CardContent className="p-6">
            <p className="text-white/80 font-medium text-sm mb-2">Total {view === 'weekly' ? 'This Week' : 'This Month'}</p>
            <p className="text-3xl font-extrabold text-white">{settings.currency}{totalSpent.toLocaleString()}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <p className="text-[var(--text-muted)] font-medium text-sm mb-2">Daily Average</p>
            <p className="text-3xl font-extrabold text-[var(--text-color)]">{settings.currency}{Math.round(totalSpent / 7).toLocaleString()}</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardContent className="p-6">
          <h3 className="text-lg font-bold mb-4">Spending Trend</h3>
          <div className="h-[180px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={weeklyData} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorAmount" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="var(--primary)" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="name" axisLine={false} tickLine={false} fontSize={12} tickMargin={12} stroke="var(--text-muted)" fontWeight="600" />
                <Tooltip 
                  contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: 'var(--shadow-soft)', fontWeight: 'bold' }}
                  formatter={(value: any) => [`${settings.currency}${value}`, 'Amount']}
                  cursor={{ stroke: 'var(--primary)', strokeWidth: 1, strokeDasharray: '4 4', fill: 'transparent' }}
                />
                <Area 
                  type="monotone" 
                  dataKey="amount" 
                  stroke="var(--primary)" 
                  strokeWidth={3}
                  fillOpacity={1} 
                  fill="url(#colorAmount)" 
                  activeDot={{ r: 6, fill: 'var(--primary)', stroke: 'white', strokeWidth: 2 }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <h3 className="text-lg font-bold mb-4">By Category</h3>
          <div className="h-[220px]">
            {categoryData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryData}
                    innerRadius={70}
                    outerRadius={90}
                    paddingAngle={6}
                    dataKey="value"
                    stroke="none"
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(value: any) => [`${settings.currency}${value}`, 'Amount']}
                    contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: 'var(--shadow-soft)', fontWeight: 'bold' }}
                  />
                  <Legend 
                    layout="horizontal" 
                    verticalAlign="bottom" 
                    align="center"
                    iconType="circle"
                    wrapperStyle={{ paddingTop: '20px', fontSize: '13px', fontWeight: '600' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-[var(--text-muted)] font-medium">
                No data available
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Calendar Section Integrated */}
      <div className="space-y-4 pt-4">
        <h2 className="text-xl font-bold">Expense Calendar</h2>
        <Card className="p-2 sm:p-6 glass-card border-none">
          <div className="flex items-center justify-between mb-6 px-2">
            <Button variant="ghost" size="icon" onClick={handlePrevMonth} className="hover:bg-[var(--secondary)]/30 text-[var(--primary)]">
              <ChevronLeft size={24} />
            </Button>
            <h2 className="text-xl font-bold text-[var(--primary)]">{format(currentDate, 'MMMM yyyy')}</h2>
            <Button variant="ghost" size="icon" onClick={handleNextMonth} className="hover:bg-[var(--secondary)]/30 text-[var(--primary)]">
              <ChevronRight size={24} />
            </Button>
          </div>

          <div className="grid grid-cols-7 gap-1 sm:gap-2 text-center mb-2 px-1">
            {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => (
              <div key={day} className="text-xs font-bold uppercase tracking-wider text-[var(--text-muted)] py-2">
                {day}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-1 sm:gap-2 px-1">
            {emptyDays.map((_, i) => (
              <div key={`empty-${i}`} className="h-16 sm:h-20 rounded-2xl bg-transparent" />
            ))}
            
            {daysInMonth.map(date => {
              const dayExpenses = expenses.filter(e => isSameDay(parseISO(e.date), date));
              const total = dayExpenses.reduce((sum, e) => sum + e.amount, 0);
              
              const isCurrentMonth = isSameMonth(date, currentDate);
              const isDayToday = isToday(date);
              
              let bgClass = 'bg-[#FBFBF9]';
              let textClass = 'text-[var(--text-muted)]';
              
              if (isDayToday) {
                bgClass = 'bg-[var(--secondary)]/30 border-2 border-[var(--primary)]/20';
                textClass = 'text-[var(--primary)] font-bold';
              } else if (total > 0) {
                bgClass = 'bg-[var(--primary)] text-white shadow-[var(--shadow-float)]';
                textClass = 'text-white/90';
              }
              
              return (
                <div 
                  key={date.toISOString()} 
                  className={`h-16 sm:h-20 rounded-2xl flex flex-col items-center justify-center p-1 transition-all ${bgClass} ${!isCurrentMonth ? 'opacity-30' : ''} ${total > 0 && !isDayToday ? 'hover:scale-105 cursor-pointer' : ''}`}
                >
                  <span className={`text-sm sm:text-base font-semibold ${textClass}`}>
                    {format(date, 'd')}
                  </span>
                  {total > 0 && (
                    <span className={`text-[10px] sm:text-xs font-bold mt-1 truncate ${isDayToday ? 'text-[var(--text-color)]' : 'text-white'}`}>
                      {settings.currency}{total}
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </Card>
      </div>
      
      {/* Spending Insights Section */}
      <div className="space-y-3">
        <h2 className="text-xl font-bold">Insights</h2>
        {categoryData.length > 0 && (
          <div className="p-4 glass-card rounded-[24px] flex items-start space-x-3">
            <div className="bg-white/70 p-2 rounded-[16px] shadow-sm text-[var(--primary)] shrink-0 border border-white">
              <Lightbulb size={20} />
            </div>
            <div>
              <p className="text-[14px] text-[var(--text-color)] font-medium leading-relaxed">
                <strong className="text-[var(--primary)]">{categoryData[0].name}</strong> is your highest spending category, making up <strong className="text-[var(--primary)]">{Math.round((categoryData[0].value / expenses.reduce((s, e) => s + e.amount, 0)) * 100)}%</strong> of your total expenses.
              </p>
            </div>
          </div>
        )}
        <div className="p-4 glass-card rounded-[24px] flex items-start space-x-3">
          <div className="bg-white/70 p-2 rounded-[16px] shadow-sm text-[var(--primary)] shrink-0 border border-white">
            <Lightbulb size={20} />
          </div>
          <div>
            <p className="text-[14px] text-[var(--text-color)] font-medium leading-relaxed">
              You had <strong className="text-[var(--primary)]">{daysInMonth.filter(d => expenses.filter(e => isSameDay(parseISO(e.date), d)).length === 0 && d <= new Date()).length}</strong> no-spend days this month so far! Keep building that streak.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
