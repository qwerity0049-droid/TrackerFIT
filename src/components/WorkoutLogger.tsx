import React, { useState } from 'react';
import { Workout, WorkoutType, Mood } from '../types';
import { Save, Clock, Activity, FileText, Calendar, Flame, Smile, ArrowRight, Target } from 'lucide-react';
import confetti from 'canvas-confetti';

interface WorkoutLoggerProps {
  onSave: (workout: Workout, redirect: boolean) => void;
  onGoToGrowth: () => void;
}

const WORKOUT_TYPES: WorkoutType[] = ['Cardio', 'Strength', 'Flexibility', 'Sports', 'Other'];
const MOODS: { value: Mood, emoji: string, label: string }[] = [
  { value: 'great', emoji: '🤩', label: 'Супер' },
  { value: 'good', emoji: '🙂', label: 'Хорошо' },
  { value: 'okay', emoji: '😐', label: 'Нормально' },
  { value: 'bad', emoji: '😫', label: 'Тяжело' },
];

export default function WorkoutLogger({ onSave, onGoToGrowth }: WorkoutLoggerProps) {
  const [type, setType] = useState<WorkoutType>('Cardio');
  const [duration, setDuration] = useState<string>('30');
  const [intensity, setIntensity] = useState<number>(3);
  const [notes, setNotes] = useState<string>('');
  const [reflection, setReflection] = useState<string>('');
  const [mood, setMood] = useState<Mood>('good');
  const [date, setDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [showModal, setShowModal] = useState(false);

  // Dynamic inspiration based on current inputs
  const getInspiration = () => {
    const mins = parseInt(duration) || 0;
    if (mins >= 60) return "Больше часа? Ты просто машина! 🔥 Твое упорство впечатляет.";
    if (intensity >= 4) return "Высокая интенсивность! Отличная работа на пределе возможностей. ⚡";
    switch(type) {
      case 'Cardio': return "Кардио отлично тренирует сердце и сжигает калории. Так держать! 🏃‍♂️";
      case 'Strength': return "Силовые тренировки строят фундамент твоего тела. Мышцы скажут спасибо! 💪";
      case 'Flexibility': return "Растяжка — залог здоровья суставов и долголетия. Отличный выбор! 🧘‍♀️";
      case 'Sports': return "Спорт — это не только фитнес, но и эмоции. Наслаждайся игрой! 🏆";
      default: return "Любая активность лучше, чем сидение на диване. Ты молодец! 🌟";
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Trigger confetti
    confetti({
      particleCount: 150,
      spread: 80,
      origin: { y: 0.6 },
      colors: ['#4f46e5', '#10b981', '#f59e0b', '#ec4899']
    });
    
    const now = new Date();
    const [year, month, day] = date.split('-');
    const workoutDate = new Date(parseInt(year), parseInt(month) - 1, parseInt(day), now.getHours(), now.getMinutes(), now.getSeconds());

    const newWorkout: Workout = {
      id: crypto.randomUUID(),
      date: workoutDate.toISOString(),
      type,
      durationMinutes: parseInt(duration) || 0,
      intensity: intensity as 1 | 2 | 3 | 4 | 5,
      notes,
      mood,
      reflection
    };

    onSave(newWorkout, false); // Save but don't redirect yet
    setShowModal(true);
  };

  if (showModal) {
    return (
      <div className="max-w-2xl mx-auto text-center py-12 px-4 bg-white rounded-3xl shadow-sm border border-gray-100 animate-in fade-in zoom-in duration-300">
        <div className="w-24 h-24 bg-green-100 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
          <Flame className="w-12 h-12" />
        </div>
        <h2 className="text-3xl font-bold text-gray-900 mb-4">Тренировка записана! 🎉</h2>
        <p className="text-lg text-gray-600 mb-8 max-w-md mx-auto">
          Отличная работа! Ты стал еще на шаг ближе к своей цели. Теперь самое время позаботиться о восстановлении и рутине.
        </p>
        
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <button 
            onClick={onGoToGrowth}
            className="py-4 px-8 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold text-lg shadow-lg shadow-indigo-200 transition-all flex items-center justify-center"
          >
            <Target className="w-5 h-5 mr-2" />
            Организовать рутину
          </button>
          <button 
            onClick={() => {
              setShowModal(false);
              // Reset form
              setDuration('30');
              setNotes('');
              setReflection('');
            }}
            className="py-4 px-8 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-bold text-lg transition-all"
          >
            Записать еще
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto pb-8">
      <h2 className="text-2xl font-bold text-gray-900 mb-2">Записать тренировку</h2>
      <p className="text-indigo-600 font-medium mb-6 bg-indigo-50 p-3 rounded-xl border border-indigo-100">
        💡 {getInspiration()}
      </p>
      
      <form onSubmit={handleSubmit} className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-gray-100 space-y-8">
        
        {/* Basic Info Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
        </div>

        {/* Type */}
        <div>
          <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
            <Activity className="w-4 h-4 mr-2 text-gray-400" />
            Тип тренировки
          </label>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
            {WORKOUT_TYPES.map(t => (
              <button
                key={t}
                type="button"
                onClick={() => setType(t)}
                className={`py-2 px-3 rounded-xl text-sm font-medium transition-all ${
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

        {/* Intensity & Mood Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4 border-t border-gray-100">
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
                  className={`flex-1 py-2 rounded-xl font-bold text-lg transition-all ${
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

          {/* Mood */}
          <div>
            <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
              <Smile className="w-4 h-4 mr-2 text-gray-400" />
              Как самочувствие?
            </label>
            <div className="flex items-center justify-between space-x-2">
              {MOODS.map(m => (
                <button
                  key={m.value}
                  type="button"
                  onClick={() => setMood(m.value)}
                  title={m.label}
                  className={`flex-1 py-2 rounded-xl text-2xl transition-all ${
                    mood === m.value 
                      ? 'bg-indigo-100 border-indigo-300 border shadow-sm transform scale-110' 
                      : 'bg-gray-50 border border-gray-200 hover:bg-gray-100 grayscale hover:grayscale-0'
                  }`}
                >
                  {m.emoji}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Reflection & Notes */}
        <div className="space-y-4 pt-4 border-t border-gray-100">
          <div>
            <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
              <Target className="w-4 h-4 mr-2 text-gray-400" />
              Что получилось хорошо? (Рефлексия)
            </label>
            <input 
              type="text"
              value={reflection}
              onChange={(e) => setReflection(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
              placeholder="Например: Взял новый вес, не сдавался до конца..."
            />
          </div>

          <div>
            <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
              <FileText className="w-4 h-4 mr-2 text-gray-400" />
              Заметки (необязательно)
            </label>
            <textarea 
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={2}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all resize-none"
              placeholder="Детали тренировки, упражнения..."
            />
          </div>
        </div>

        <button 
          type="submit"
          className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold text-lg shadow-lg shadow-indigo-200 transition-all flex items-center justify-center group"
        >
          <Save className="w-5 h-5 mr-2" />
          Сохранить тренировку
          <ArrowRight className="w-5 h-5 ml-2 opacity-0 group-hover:opacity-100 transition-opacity transform -translate-x-2 group-hover:translate-x-0" />
        </button>
      </form>
    </div>
  );
}
