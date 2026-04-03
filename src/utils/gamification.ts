import { Workout } from '../types';
import { subDays, startOfDay } from 'date-fns';

export function calculateXP(workouts: Workout[]) {
  // 10 XP per minute + 5 XP per intensity level
  return workouts.reduce((acc, w) => acc + w.durationMinutes * 10 + (w.intensity * 5), 0);
}

export function getLevel(xp: number) {
  // Level 1: 0-100, Level 2: 100-400, Level 3: 400-900...
  return Math.floor(Math.sqrt(xp / 100)) + 1;
}

export function getXPForNextLevel(level: number) {
  return Math.pow(level, 2) * 100;
}

export function getXPForCurrentLevel(level: number) {
  return Math.pow(level - 1, 2) * 100;
}

export function calculateStreak(workouts: Workout[]) {
  if (workouts.length === 0) return 0;
  
  const dates = workouts.map(w => startOfDay(new Date(w.date)).getTime());
  const uniqueDates = Array.from(new Set(dates)).sort((a, b) => b - a);
  
  let streak = 0;
  let currentDate = startOfDay(new Date());
  
  // Check if there's a workout today or yesterday to start the streak
  if (uniqueDates.length > 0 && (uniqueDates[0] === currentDate.getTime() || uniqueDates[0] === subDays(currentDate, 1).getTime())) {
    let checkDate = uniqueDates[0];
    for (const date of uniqueDates) {
      if (date === checkDate) {
        streak++;
        checkDate = subDays(new Date(checkDate), 1).getTime();
      } else {
        break;
      }
    }
  }
  return streak;
}

export const ACHIEVEMENTS = [
  { id: 'first', title: 'Первый шаг', desc: 'Записать первую тренировку', icon: '🎯' },
  { id: 'streak3', title: 'В огне', desc: '3 дня тренировок подряд', icon: '🔥' },
  { id: 'streak7', title: 'Железная воля', desc: '7 дней тренировок подряд', icon: '👑' },
  { id: 'marathon', title: 'Марафонец', desc: 'Более 1000 минут тренировок', icon: '🏃' },
  { id: 'variety', title: 'Разносторонний', desc: 'Попробовать 3 разных типа тренировок', icon: '🌈' },
  { id: 'early', title: 'Жаворонок', desc: 'Тренировка до 8 утра', icon: '🌅' },
  { id: 'night', title: 'Сова', desc: 'Тренировка после 20:00', icon: '🦉' },
];

export function getUnlockedAchievements(workouts: Workout[]) {
  const unlocked = new Set<string>();
  if (workouts.length > 0) unlocked.add('first');
  
  const streak = calculateStreak(workouts);
  if (streak >= 3) unlocked.add('streak3');
  if (streak >= 7) unlocked.add('streak7');
  
  const totalMinutes = workouts.reduce((acc, w) => acc + w.durationMinutes, 0);
  if (totalMinutes >= 1000) unlocked.add('marathon');
  
  const types = new Set(workouts.map(w => w.type));
  if (types.size >= 3) unlocked.add('variety');
  
  const hasEarly = workouts.some(w => new Date(w.date).getHours() < 8);
  if (hasEarly) unlocked.add('early');
  
  const hasNight = workouts.some(w => new Date(w.date).getHours() >= 20);
  if (hasNight) unlocked.add('night');
  
  return Array.from(unlocked);
}
