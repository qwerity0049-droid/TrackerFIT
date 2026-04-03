import React, { useState } from 'react';
import { UserProfile, Workout } from '../types';
import { Save, User, Target, Clock, Award } from 'lucide-react';
import { ACHIEVEMENTS, getUnlockedAchievements } from '../utils/gamification';

interface ProfileProps {
  profile: UserProfile;
  workouts: Workout[];
  onSave: (profile: UserProfile) => void;
}

export default function Profile({ profile, workouts, onSave }: ProfileProps) {
  const [name, setName] = useState(profile.name);
  const [goal, setGoal] = useState(profile.goal);
  const [weeklyGoalMinutes, setWeeklyGoalMinutes] = useState(profile.weeklyGoalMinutes.toString());
  const [saved, setSaved] = useState(false);

  const unlockedIds = getUnlockedAchievements(workouts);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      name,
      goal,
      weeklyGoalMinutes: parseInt(weeklyGoalMinutes) || 150
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Личный кабинет</h2>
        
        <form onSubmit={handleSubmit} className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-gray-100 space-y-6">
          
          {/* Name */}
          <div>
            <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
              <User className="w-4 h-4 mr-2 text-gray-400" />
              Ваше имя
            </label>
            <input 
              type="text" 
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
              placeholder="Как к вам обращаться?"
              required
            />
          </div>

          {/* Goal */}
          <div>
            <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
              <Target className="w-4 h-4 mr-2 text-gray-400" />
              Главная цель
            </label>
            <input 
              type="text" 
              value={goal}
              onChange={(e) => setGoal(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
              placeholder="Например: Похудеть к лету, Пробежать марафон..."
              required
            />
          </div>

          {/* Weekly Goal */}
          <div>
            <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
              <Clock className="w-4 h-4 mr-2 text-gray-400" />
              Цель на неделю (минут активности)
            </label>
            <input 
              type="number" 
              min="10"
              step="10"
              value={weeklyGoalMinutes}
              onChange={(e) => setWeeklyGoalMinutes(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
              placeholder="Рекомендуется 150 минут"
              required
            />
            <p className="text-xs text-gray-500 mt-2">
              ВОЗ рекомендует не менее 150 минут умеренной активности в неделю.
            </p>
          </div>

          <button 
            type="submit"
            className={`w-full py-4 rounded-xl font-bold text-lg shadow-lg transition-all flex items-center justify-center ${
              saved 
                ? 'bg-green-500 hover:bg-green-600 text-white shadow-green-200' 
                : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-200'
            }`}
          >
            <Save className="w-5 h-5 mr-2" />
            {saved ? 'Сохранено!' : 'Сохранить настройки'}
          </button>
        </form>
      </div>

      {/* Achievements Section */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
          <Award className="w-6 h-6 mr-2 text-yellow-500" />
          Достижения ({unlockedIds.length} / {ACHIEVEMENTS.length})
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {ACHIEVEMENTS.map(achievement => {
            const isUnlocked = unlockedIds.includes(achievement.id);
            return (
              <div 
                key={achievement.id} 
                className={`p-5 rounded-2xl border transition-all ${
                  isUnlocked 
                    ? 'bg-white border-yellow-200 shadow-sm hover:shadow-md' 
                    : 'bg-gray-50 border-gray-100 opacity-60 grayscale'
                }`}
              >
                <div className="text-4xl mb-3">{achievement.icon}</div>
                <h3 className={`font-bold text-lg ${isUnlocked ? 'text-gray-900' : 'text-gray-500'}`}>
                  {achievement.title}
                </h3>
                <p className="text-sm text-gray-500 mt-1">{achievement.desc}</p>
                
                {isUnlocked && (
                  <div className="mt-3 inline-block px-2 py-1 bg-green-100 text-green-700 text-xs font-bold rounded-md">
                    Получено
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
