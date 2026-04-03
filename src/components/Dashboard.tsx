import React from 'react';
import { Workout, UserProfile } from '../types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { format, subDays, isSameDay, startOfWeek, endOfWeek, isWithinInterval } from 'date-fns';
import { ru } from 'date-fns/locale';
import { Flame, Timer, Trophy, TrendingUp, Star, Quote } from 'lucide-react';
import { calculateXP, getLevel, getXPForNextLevel, getXPForCurrentLevel, calculateStreak } from '../utils/gamification';
import { getDailyQuote } from '../utils/quotes';

interface DashboardProps {
  workouts: Workout[];
  profile: UserProfile;
}

export default function Dashboard({ workouts, profile }: DashboardProps) {
  // Calculate stats
  const today = new Date();
  const startOfCurrentWeek = startOfWeek(today, { weekStartsOn: 1 });
  const endOfCurrentWeek = endOfWeek(today, { weekStartsOn: 1 });

  const thisWeekWorkouts = workouts.filter(w => 
    isWithinInterval(new Date(w.date), { start: startOfCurrentWeek, end: endOfCurrentWeek })
  );

  const thisWeekMinutes = thisWeekWorkouts.reduce((acc, w) => acc + w.durationMinutes, 0);
  const totalMinutes = workouts.reduce((acc, w) => acc + w.durationMinutes, 0);
  const totalWorkouts = workouts.length;

  // Gamification
  const xp = calculateXP(workouts);
  const level = getLevel(xp);
  const currentLevelXP = getXPForCurrentLevel(level);
  const nextLevelXP = getXPForNextLevel(level);
  const xpProgress = Math.min(Math.round(((xp - currentLevelXP) / (nextLevelXP - currentLevelXP)) * 100), 100);
  const streak = calculateStreak(workouts);
  const quote = getDailyQuote();

  // Chart data (last 7 days)
  const chartData = Array.from({ length: 7 }).map((_, i) => {
    const date = subDays(today, 6 - i);
    const dayWorkouts = workouts.filter(w => isSameDay(new Date(w.date), date));
    const minutes = dayWorkouts.reduce((acc, w) => acc + w.durationMinutes, 0);
    return {
      name: format(date, 'E', { locale: ru }),
      minutes,
      date: format(date, 'dd MMM', { locale: ru })
    };
  });

  const progressPercentage = Math.min(Math.round((thisWeekMinutes / profile.weeklyGoalMinutes) * 100), 100);

  return (
    <div className="space-y-6">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Привет, {profile.name}! 👋</h1>
          <p className="text-gray-500 mt-1">Твоя цель: {profile.goal}</p>
        </div>
        
        {/* Level Badge */}
        <div className="bg-gradient-to-r from-indigo-500 to-purple-600 p-4 rounded-2xl text-white shadow-lg shadow-indigo-200 md:w-64 flex-shrink-0">
          <div className="flex justify-between items-center mb-2">
            <span className="font-bold flex items-center"><Star className="w-4 h-4 mr-1 fill-current" /> Уровень {level}</span>
            <span className="text-sm opacity-90">{xp} / {nextLevelXP} XP</span>
          </div>
          <div className="w-full bg-white/20 rounded-full h-2 overflow-hidden">
            <div 
              className="bg-white h-2 rounded-full transition-all duration-1000 ease-out"
              style={{ width: `${xpProgress}%` }}
            ></div>
          </div>
        </div>
      </header>

      {/* Daily Quote */}
      <div className="bg-indigo-50 border border-indigo-100 p-4 rounded-2xl flex items-start space-x-3">
        <Quote className="w-6 h-6 text-indigo-400 flex-shrink-0 mt-1" />
        <p className="text-indigo-900 font-medium italic">"{quote}"</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard 
          icon={<Flame className={`w-6 h-6 ${streak > 0 ? 'text-orange-500 fill-orange-500' : 'text-gray-400'}`} />}
          title="Серия тренировок"
          value={`${streak} дней`}
          subtitle={streak > 0 ? "Так держать!" : "Пора начать!"}
          highlight={streak > 0}
        />
        <StatCard 
          icon={<Timer className="w-6 h-6 text-blue-500" />}
          title="Минут за неделю"
          value={`${thisWeekMinutes} / ${profile.weeklyGoalMinutes}`}
          subtitle={`${progressPercentage}% от цели`}
        />
        <StatCard 
          icon={<Trophy className="w-6 h-6 text-yellow-500" />}
          title="Всего тренировок"
          value={totalWorkouts.toString()}
          subtitle="За все время"
        />
        <StatCard 
          icon={<TrendingUp className="w-6 h-6 text-green-500" />}
          title="Всего времени"
          value={`${Math.floor(totalMinutes / 60)}ч ${totalMinutes % 60}м`}
          subtitle="Проведено с пользой"
        />
      </div>

      {/* Progress Bar */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <div className="flex justify-between items-end mb-2">
          <div>
            <h3 className="text-lg font-semibold text-gray-800">Прогресс недели</h3>
            <p className="text-sm text-gray-500">Цель: {profile.weeklyGoalMinutes} минут</p>
          </div>
          <span className="text-2xl font-bold text-indigo-600">{progressPercentage}%</span>
        </div>
        <div className="w-full bg-gray-100 rounded-full h-4 overflow-hidden">
          <div 
            className="bg-indigo-600 h-4 rounded-full transition-all duration-1000 ease-out"
            style={{ width: `${progressPercentage}%` }}
          ></div>
        </div>
      </div>

      {/* Chart */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <h3 className="text-lg font-semibold text-gray-800 mb-6">Активность за последние 7 дней</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
              <XAxis 
                dataKey="name" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: '#6b7280', fontSize: 12 }} 
                dy={10}
              />
              <YAxis 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: '#6b7280', fontSize: 12 }} 
              />
              <Tooltip 
                cursor={{ fill: '#f3f4f6' }}
                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                labelStyle={{ color: '#374151', fontWeight: 'bold', marginBottom: '4px' }}
                formatter={(value: number) => [`${value} мин`, 'Время']}
                labelFormatter={(label, payload) => payload[0]?.payload.date || label}
              />
              <Bar dataKey="minutes" radius={[6, 6, 0, 0]}>
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.minutes > 0 ? '#4f46e5' : '#e5e7eb'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

function StatCard({ icon, title, value, subtitle, highlight = false }: { icon: React.ReactNode, title: string, value: string, subtitle: string, highlight?: boolean }) {
  return (
    <div className={`bg-white p-6 rounded-2xl shadow-sm border flex items-start space-x-4 transition-all ${highlight ? 'border-orange-200 bg-orange-50/30' : 'border-gray-100'}`}>
      <div className={`p-3 rounded-xl ${highlight ? 'bg-orange-100' : 'bg-gray-50'}`}>
        {icon}
      </div>
      <div>
        <p className="text-sm font-medium text-gray-500">{title}</p>
        <h4 className="text-2xl font-bold text-gray-900 mt-1">{value}</h4>
        <p className="text-xs text-gray-400 mt-1">{subtitle}</p>
      </div>
    </div>
  );
}
