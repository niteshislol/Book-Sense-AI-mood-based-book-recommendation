import React from 'react';
import { Book } from '../types';
import BookCard from './BookCard';

interface BookGridProps {
  title: string;
  subtitle?: string;
  books: Book[];
  onBookClick?: (book: Book) => void;
}

const BookGrid: React.FC<BookGridProps> = ({ title, subtitle, books, onBookClick }) => {
  const [sortOption, setSortOption] = React.useState('relevance');

  const sortedBooks = [...books].sort((a, b) => {
    switch (sortOption) {
      case 'price_low_high':
        return (a.price || 0) - (b.price || 0);
      case 'price_high_low':
        return (b.price || 0) - (a.price || 0);
      case 'rating':
        return b.rating - a.rating;
      case 'az':
        return a.title.localeCompare(b.title);
      case 'za':
        return b.title.localeCompare(a.title);
      default:
        return 0; // Keep original order
    }
  });

  return (
    <div className="container mx-auto px-6 py-24 min-h-screen">
      <div className="flex flex-col md:flex-row items-center justify-between mb-16">
        <div className="text-center md:text-left mb-6 md:mb-0">
          <h2 className="text-4xl md:text-5xl font-poppins font-bold text-gray-900 dark:text-white mb-4 animate-[fadeIn_0.5s_ease-out_forwards]">
            {title}
          </h2>
          {subtitle && (
            <p className="text-gray-600 dark:text-gray-400 text-lg font-inter">{subtitle}</p>
          )}
        </div>

        {/* Sort Controls */}
        {books.length > 0 && (
          <div className="relative">
            <select
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value)}
              className="appearance-none bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 text-gray-900 dark:text-gray-200 py-2 pl-4 pr-10 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#6f57ff] cursor-pointer"
            >
              <option value="relevance">Sort by: Relevance</option>
              <option value="price_low_high">Price: Low to High</option>
              <option value="price_high_low">Price: High to Low</option>
              <option value="rating">Top Rated</option>
              <option value="az">Title: A-Z</option>
              <option value="za">Title: Z-A</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-500">
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
            </div>
          </div>
        )}
      </div>

      {sortedBooks.length === 0 ? (
        <div className="text-center text-gray-500 py-20 bg-white/50 dark:bg-white/5 rounded-3xl border border-gray-200 dark:border-white/5">
          <p>No books found. Try searching or using Mood AI.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {sortedBooks.map((book, index) => (
            <div
              key={book.id}
              className="opacity-0 animate-[fadeIn_0.5s_ease-out_forwards]"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <BookCard book={book} onClick={() => onBookClick && onBookClick(book)} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default BookGrid;