export interface Book {
  id: string;
  title: string;
  author: string;
  description: string;
  coverUrl: string;
  rating: number;
  genre: string;
  year?: number;
}

export interface MoodResult {
  mood: string;
  confidence: number;
  suggestedGenres: string[];
}

export type Page = 'home' | 'discover' | 'top-books' | 'mood-ai' | 'recommendations';

export interface MoodMapping {
  [key: string]: string[];
}
