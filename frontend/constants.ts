import { Book, MoodMapping } from './types';

export const APP_NAME = "BookSense AI";

export const MOCK_BOOKS: Book[] = [
  {
    id: '1',
    title: 'The Midnight Library',
    author: 'Matt Haig',
    description: 'Between life and death there is a library, and within that library, the shelves go on forever.',
    coverUrl: 'https://picsum.photos/seed/midnight/300/450',
    rating: 4.8,
    genre: 'Fiction',
    year: 2020
  },
  {
    id: '2',
    title: 'Project Hail Mary',
    author: 'Andy Weir',
    description: 'A lone astronaut must save the earth from disaster in this propulsive science-fiction thriller.',
    coverUrl: 'https://picsum.photos/seed/hailmary/300/450',
    rating: 4.9,
    genre: 'Sci-Fi',
    year: 2021
  },
  {
    id: '3',
    title: 'Atomic Habits',
    author: 'James Clear',
    description: 'An easy & proven way to build good habits & break bad ones.',
    coverUrl: 'https://picsum.photos/seed/atomic/300/450',
    rating: 4.9,
    genre: 'Self-Help',
    year: 2018
  },
  {
    id: '4',
    title: 'Dune',
    author: 'Frank Herbert',
    description: 'Set on the desert planet Arrakis, Dune is the story of the boy Paul Atreides.',
    coverUrl: 'https://picsum.photos/seed/dune/300/450',
    rating: 4.7,
    genre: 'Sci-Fi',
    year: 1965
  },
  {
    id: '5',
    title: 'Educated',
    author: 'Tara Westover',
    description: 'A memoir about a young girl who, kept out of school, leaves her survivalist family and goes on to earn a PhD.',
    coverUrl: 'https://picsum.photos/seed/educated/300/450',
    rating: 4.6,
    genre: 'Biography',
    year: 2018
  },
  {
    id: '6',
    title: 'Dark Matter',
    author: 'Blake Crouch',
    description: 'A mind-bending sci-fi thriller about choices, paths not taken, and how far we\'ll go to claim the lives we dream of.',
    coverUrl: 'https://picsum.photos/seed/darkmatter/300/450',
    rating: 4.5,
    genre: 'Thriller',
    year: 2016
  }
];

export const MOOD_GENRE_MAP: MoodMapping = {
  'Happy': ['Comedy', 'Adventure', 'Fantasy', 'Fiction'],
  'Sad': ['Inspirational', 'Healing', 'Self-Help', 'Literary Fiction'],
  'Excited': ['Sci-Fi', 'Action', 'Fantasy', 'Thriller'],
  'Bored': ['Mystery', 'Thriller', 'Page-turner', 'Crime'],
  'Stressed': ['Mindfulness', 'Philosophy', 'Cozy Mystery', 'Light Fiction'],
  'Romantic': ['Romance', 'Classics', 'Poetry', 'Contemporary'],
};

export const CATEGORIES = [
  'All', 'Sci-Fi', 'Fiction', 'Mystery', 'Biography', 'Self-Help', 'Thriller'
];
