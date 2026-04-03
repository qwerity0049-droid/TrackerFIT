import React, { useState } from 'react';
import { Habit, Goal } from '../types';
import { CheckCircle2, Circle, Plus, Target, Sprout, Droplets, Moon, Zap, Trash2 } from 'lucide-react';
import { format } from 'date-fns';

interface GrowthProps {
  habits: Habit[];
  setHabits: (habits: Habit[]) => void;
  goals: Goal[];
  setGoals: (goals: Goal[]) => void;
}

const DEFAULT_HABITS = [
  { id: 'h1', title: 'Пить 2л воды', icon: '💧', completedDates: [] },
  { id: 'h2', title: 'Спать 8 часов', icon: '🌙', completedDates: [] },
  { id: 'h3', title: 'Растяжка 10 мин', icon: '🧘', completedDates: [] },
];

export default function Growth({ habits, setHabits, goals, setGoals }: GrowthProps) {
  const [newGoalTitle, setNewGoalTitle] = useState('');
  const [newHabitTitle, setNewHabitTitle] = useState('');
  
  const todayStr = format(new Date(), 'yyyy-MM-dd');

  // Initialize default habits if empty
  React.useEffect(() => {
    if (habits.length === 0) {
      setHabits(DEFAULT_HABITS);
    }
  }, []);

  const toggleHabit = (habitId: string) => {
    setHabits(habits.map(h => {
      if (h.id === habitId) {
        const isCompletedToday = h.completedDates.includes(todayStr);
        return {
          ...h,
          completedDates: isCompletedToday 
            ? h.completedDates.filter(d => d !== todayStr)
            : [...h.completedDates, todayStr]
        };
      }
      return h;
    }));
  };

  const addGoal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGoalTitle.trim()) return;
    setGoals([...goals, { id: crypto.randomUUID(), title: newGoalTitle, completed: false }]);
    setNewGoalTitle('');
  };

  const toggleGoal = (goalId: string) => {
    setGoals(goals.map(g => g.id === goalId ? { ...g, completed: !g.completed } : g));
  };

  const deleteGoal = (goalId: string) => {
    setGoals(goals.filter(g => g.id !== goalId));
  };

  const addHabit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newHabitTitle.trim()) return;
    setHabits([...habits, { id: crypto.randomUUID(), title: newHabitTitle, icon: '✨', completedDates: [] }]);
    setNewHabitTitle('');
  };

  const deleteHabit = (habitId: string) => {
    setHabits(habits.filter(h => h.id !== habitId));
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-8">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 flex items-center">
          <Sprout className="w-8 h-8 mr-3 text-green-500" />
          Развитие и Рутина
        </h1>
        <p className="text-gray-500 mt-2">Спорт — это не только тренировки, но и ежедневные привычки.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Habits Section */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-800 flex items-center">
              <Zap className="w-5 h-5 mr-2 text-yellow-500" />
              Привычки на сегодня
            </h2>
          </div>

          <div className="space-y-3 mb-6">
            {habits.map(habit => {
              const isCompleted = habit.completedDates.includes(todayStr);
              return (
                <div 
                  key={habit.id} 
                  className={`flex items-center justify-between p-4 rounded-xl border transition-all cursor-pointer ${
                    isCompleted ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-gray-100 hover:border-indigo-200'
                  }`}
                  onClick={() => toggleHabit(habit.id)}
                >
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl">{habit.icon}</span>
                    <span className={`font-medium ${isCompleted ? 'text-green-800 line-through opacity-70' : 'text-gray-700'}`}>
                      {habit.title}
                    </span>
                  </div>
                  <div className="flex items-center space-x-3">
                    {isCompleted ? (
                      <CheckCircle2 className="w-6 h-6 text-green-500" />
                    ) : (
                      <Circle className="w-6 h-6 text-gray-300" />
                    )}
                    <button 
                      onClick={(e) => { e.stopPropagation(); deleteHabit(habit.id); }}
                      className="text-gray-400 hover:text-red-500 p-1"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          <form onSubmit={addHabit} className="flex space-x-2">
            <input 
              type="text" 
              value={newHabitTitle}
              onChange={(e) => setNewHabitTitle(e.target.value)}
              placeholder="Новая привычка..."
              className="flex-1 px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 outline-none text-sm"
            />
            <button type="submit" className="p-2 bg-indigo-100 text-indigo-600 rounded-xl hover:bg-indigo-200 transition-colors">
              <Plus className="w-5 h-5" />
            </button>
          </form>
        </div>

        {/* Goals Section */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-800 flex items-center">
              <Target className="w-5 h-5 mr-2 text-indigo-500" />
              Мои цели
            </h2>
          </div>

          <div className="space-y-3 mb-6">
            {goals.length === 0 ? (
              <p className="text-gray-500 text-sm text-center py-4 bg-gray-50 rounded-xl border border-dashed border-gray-200">
                У вас пока нет активных целей. Самое время их поставить!
              </p>
            ) : (
              goals.map(goal => (
                <div 
                  key={goal.id} 
                  className={`flex items-start justify-between p-4 rounded-xl border transition-all ${
                    goal.completed ? 'bg-gray-50 border-gray-200 opacity-60' : 'bg-white border-indigo-100 shadow-sm'
                  }`}
                >
                  <div className="flex items-start space-x-3 flex-1 cursor-pointer" onClick={() => toggleGoal(goal.id)}>
                    <div className="mt-0.5">
                      {goal.completed ? (
                        <CheckCircle2 className="w-5 h-5 text-indigo-500" />
                      ) : (
                        <Circle className="w-5 h-5 text-gray-300" />
                      )}
                    </div>
                    <span className={`font-medium ${goal.completed ? 'line-through text-gray-500' : 'text-gray-800'}`}>
                      {goal.title}
                    </span>
                  </div>
                  <button 
                    onClick={() => deleteGoal(goal.id)}
                    className="text-gray-400 hover:text-red-500 p-1 ml-2"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))
            )}
          </div>

          <form onSubmit={addGoal} className="flex space-x-2">
            <input 
              type="text" 
              value={newGoalTitle}
              onChange={(e) => setNewGoalTitle(e.target.value)}
              placeholder="Например: Пробежать 5 км без остановки"
              className="flex-1 px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 outline-none text-sm"
            />
            <button type="submit" className="p-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors">
              <Plus className="w-5 h-5" />
            </button>
          </form>
        </div>
      </div>
      
      {/* Personal Growth Insights */}
      <div className="bg-gradient-to-br from-indigo-900 to-purple-900 rounded-2xl p-6 md:p-8 text-white shadow-lg">
        <h3 className="text-xl font-bold mb-4 flex items-center">
          <Moon className="w-6 h-6 mr-2 text-indigo-300" />
          Совет для роста
        </h3>
        <p className="text-indigo-100 leading-relaxed">
          Мышцы растут не во время тренировки, а во время отдыха. Убедитесь, что вы спите 7-8 часов и потребляете достаточное количество белка. Попробуйте добавить привычку "Растяжка перед сном" в свой трекер, чтобы улучшить качество сна и гибкость!
        </p>
      </div>
    </div>
  );
}
