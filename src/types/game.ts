export type ScoreValue = number | null;

export type CategoryKey =
  | 'ones'
  | 'twos'
  | 'threes'
  | 'fours'
  | 'fives'
  | 'sixes'
  | 'straight'
  | 'fullHouse'
  | 'poker'
  | 'generala'
  | 'doubleGenerala';

export interface Category {
  key: CategoryKey;
  label: string;
  maxScore: number;
  isBonus?: boolean;
}

export interface PlayerScore {
  [key: string]: ScoreValue;
}

export interface Player {
  id: string;
  name: string;
  scores: PlayerScore;
}

export interface GameState {
  players: Player[];
  started: boolean;
  finished: boolean;
}

export const CATEGORIES: Category[] = [
  { key: 'ones', label: 'Uno', maxScore: 5 },
  { key: 'twos', label: 'Dos', maxScore: 10 },
  { key: 'threes', label: 'Tres', maxScore: 15 },
  { key: 'fours', label: 'Cuatro', maxScore: 20 },
  { key: 'fives', label: 'Cinco', maxScore: 25 },
  { key: 'sixes', label: 'Seis', maxScore: 30 },
  { key: 'straight', label: 'Escalera', maxScore: 20 },
  { key: 'fullHouse', label: 'Full', maxScore: 30 },
  { key: 'poker', label: 'Póker', maxScore: 40 },
  { key: 'generala', label: 'Generala', maxScore: 50 },
  { key: 'doubleGenerala', label: 'Doble', maxScore: 100 },
];

export const SCORE_OPTIONS: Record<CategoryKey, number[]> = {
  ones: [0, 1, 2, 3, 4, 5],
  twos: [0, 2, 4, 6, 8, 10],
  threes: [0, 3, 6, 9, 12, 15],
  fours: [0, 4, 8, 12, 16, 20],
  fives: [0, 5, 10, 15, 20, 25],
  sixes: [0, 6, 12, 18, 24, 30],
  straight: [0, 20],
  fullHouse: [0, 30],
  poker: [0, 40],
  generala: [0, 50],
  doubleGenerala: [0, 100],
};
