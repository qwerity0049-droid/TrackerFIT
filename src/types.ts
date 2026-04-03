export type WorkoutType = 'Cardio' | 'Strength' | 'Flexibility' | 'Sports' | 'Other';

export interface Workout {
  id: string;
  date: string; // ISO string
  type: WorkoutType;
  durationMinutes: number;
  intensity: 1 | 2 | 3 | 4 | 5;
  notes?: string;
}

export interface UserProfile {
  name: string;
  goal: string;
  weeklyGoalMinutes: number;
}
