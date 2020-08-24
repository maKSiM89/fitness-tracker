export type ExerciseState = 'completed' | 'cancelled' | null;

export interface Exercise {
  id: string;
  name: string;
  duration: number;
  calories: number;
  date?: Date;
  state?: ExerciseState;
}
