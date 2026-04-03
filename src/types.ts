export type WorkoutType = 'Cardio' | 'Strength' | 'Flexibility' | 'Sports' | 'Other';
export type Mood = 'great' | 'good' | 'okay' | 'bad';

export interface Workout {
  id: string;
  date: string; // ISO string
  type: WorkoutType;
  durationMinutes: number;
  intensity: 1 | 2 | 3 | 4 | 5;
  notes?: string;
  mood?: Mood;
  reflection?: string;
}

export interface UserProfile {
  name: string;
  goal: string;
  weeklyGoalMinutes: number;
}

export interface Habit {
  id: string;
  title: string;
  icon: string;
  completedDates: string[]; // Array of ISO date strings (YYYY-MM-DD)
}

export interface Goal {
  id: string;
  title: string;
  deadline?: string;
  completed: boolean;
}

