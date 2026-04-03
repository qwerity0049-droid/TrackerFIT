import React from 'react';
import { Workout } from '../types';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';
import { Trash2, Activity, Clock, Flame } from 'lucide-react';

interface WorkoutHistoryProps {
  workouts: Workout[];
  onDelete: (id: string) => void;
}

export default function WorkoutHistory({ workouts, onDelete }: WorkoutHistoryProps) {
  if (workouts.length === 0) {
    return (
      <div className="text-center py-20">
        <div className="bg-gray-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
          <Activity className="w-10 h-10 text-gray-400" />
        </div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">История пуста</h2>
        <p className="text-gray-500">Запишите свою первую тренировку, чтобы увидеть ее здесь.</p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">История тренировок</h2>
      
      <div className="space-y-4">
        {workouts.map(workout => (
          <div key={workout.id} className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4 group transition-all hover:shadow-md">
            
            <div className="flex items-start space-x-4">
              <div className={`p-3 rounded-xl flex-shrink-0 ${
                workout.type === 'Cardio' ? 'bg-blue-100 text-blue-600' :
                workout.type === 'Strength' ? 'bg-purple-100 text-purple-600' :
                workout.type === 'Flexibility' ? 'bg-green-100 text-green-600' :
                workout.type === 'Sports' ? 'bg-orange-100 text-orange-600' :
                'bg-gray-100 text-gray-600'
              }`}>
                <Activity className="w-6 h-6" />
              </div>
              
              <div>
                <h3 className="text-lg font-bold text-gray-900">
                  {workout.type === 'Cardio' ? 'Кардио' : 
                   workout.type === 'Strength' ? 'Силовая' : 
                   workout.type === 'Flexibility' ? 'Растяжка' : 
                   workout.type === 'Sports' ? 'Спорт' : 'Другое'}
                </h3>
                <p className="text-sm text-gray-500">
                  {format(new Date(workout.date), 'd MMMM yyyy, HH:mm', { locale: ru })}
                </p>
                
                {workout.notes && (
                  <p className="text-sm text-gray-600 mt-2 bg-gray-50 p-2 rounded-lg border border-gray-100">
                    "{workout.notes}"
                  </p>
                )}
              </div>
            </div>

            <div className="flex items-center justify-between sm:justify-end w-full sm:w-auto space-x-6 border-t sm:border-t-0 pt-4 sm:pt-0 border-gray-100">
              <div className="flex space-x-4">
                <div className="flex items-center text-gray-600">
                  <Clock className="w-4 h-4 mr-1 text-gray-400" />
                  <span className="font-medium">{workout.durationMinutes} мин</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <Flame className="w-4 h-4 mr-1 text-orange-400" />
                  <span className="font-medium">{workout.intensity}/5</span>
                </div>
              </div>
              
              <button 
                onClick={() => {
                  if (window.confirm('Удалить эту тренировку?')) {
                    onDelete(workout.id);
                  }
                }}
                className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                title="Удалить"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
