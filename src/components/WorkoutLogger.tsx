import React, { useState } from 'react';
import { Workout, WorkoutType } from '../types';
import { Save, Clock, Activity, FileText, Calendar, Flame } from 'lucide-react';
import confetti from 'canvas-confetti';

interface WorkoutLoggerProps {
  onSave: (workout: Workout) => void;
}

const WORKOUT_TYPES: WorkoutType[] = ['Cardio', 'Strength', 'Flexibility', 'Sports', 'Other'];

export default function WorkoutLogger({ onSave }: WorkoutLoggerProps) {
  const [type, setType] = useState<WorkoutType>('Cardio');
  const [duration, setDuration] = useState<string>('30');
  const [intensity, setIntensity] = useState<number>(3);
  const [notes, setNotes] = useState<string>('');
  const [date, setDate] = useState<string>(new Date().toISOString().split('T')[0]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Trigger confetti
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#4f46e5', '#10b981', '#f59e0b', '#ec4899']
    });
    
    // Combine date with current time to keep sorting accurate
    const now = new Date();
    const [year, month, day] = date.split('-');
    const workoutDate = new Date(parseInt(year), parseInt(month) - 1, parseInt(day), now.getHours(), now.getMinutes(), now.getSeconds());

    const newWorkout: Workout = {
      id: crypto.randomUUID(),
      date: workoutDate.toISOString(),
      type,
      durationMinutes: parseInt(duration) || 0,
      intensity: intensity as 1 | 2 | 3 | 4 | 5,
      notes
    };

    // Delay slightly so user sees confetti before tab switch
    setTimeout(() => {
      onSave(newWorkout);
    }, 800);
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Записать тренировку</h2>
      
      <form onSubmit={handleSubmit} className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-gray-100 space-y-6">
        
        {/* Date */}
        <div>
          <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
            <Calendar className="w-4 h-4 mr-2 text-gray-400" />
            Дата
          </label>
          <input 
            type="date" 
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
            required
          />
        </div>

        {/* Type */}
        <div>
          <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
            <Activity className="w-4 h-4 mr-2 text-gray-400" />
            Тип тренировки
          </label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {WORKOUT_TYPES.map(t => (
              <button
                key={t}
                type="button"
                onClick={() => setType(t)}
                className={`py-2 px-4 rounded-xl text-sm font-medium transition-all ${
                  type === t 
                    ? 'bg-indigo-600 text-white shadow-md' 
                    : 'bg-gray-50 text-gray-600 hover:bg-gray-100 border border-gray-200'
                }`}
              >
                {t === 'Cardio' ? 'Кардио' : 
                 t === 'Strength' ? 'Силовая' : 
                 t === 'Flexibility' ? 'Растяжка' : 
                 t === 'Sports' ? 'Спорт' : 'Другое'}
              </button>
            ))}
          </div>
        </div>

        {/* Duration */}
        <div>
          <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
            <Clock className="w-4 h-4 mr-2 text-gray-400" />
            Длительность (минут)
          </label>
          <input 
            type="number" 
            min="1"
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
            placeholder="Например, 45"
            required
          />
        </div>

        {/* Intensity */}
        <div>
          <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
            <Flame className="w-4 h-4 mr-2 text-gray-400" />
            Интенсивность (1-5)
          </label>
          <div className="flex items-center justify-between space-x-2">
            {[1, 2, 3, 4, 5].map(level => (
              <button
                key={level}
                type="button"
                onClick={() => setIntensity(level)}
                className={`flex-1 py-3 rounded-xl font-bold text-lg transition-all ${
                  intensity === level 
                    ? 'bg-orange-500 text-white shadow-md transform scale-105' 
                    : 'bg-gray-50 text-gray-400 hover:bg-gray-100 border border-gray-200'
                }`}
              >
                {level}
              </button>
            ))}
          </div>
          <div className="flex justify-between text-xs text-gray-400 mt-2 px-1">
            <span>Легко</span>
            <span>Тяжело</span>
          </div>
        </div>

        {/* Notes */}
        <div>
          <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
            <FileText className="w-4 h-4 mr-2 text-gray-400" />
            Заметки (необязательно)
          </label>
          <textarea 
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={3}
            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all resize-none"
            placeholder="Как прошла тренировка?"
          />
        </div>

        <button 
          type="submit"
          className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold text-lg shadow-lg shadow-indigo-200 transition-all flex items-center justify-center"
        >
          <Save className="w-5 h-5 mr-2" />
          Сохранить тренировку
        </button>
      </form>
    </div>
  );
}
