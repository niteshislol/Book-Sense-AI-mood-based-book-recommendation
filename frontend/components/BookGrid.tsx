import React from 'react';
import { Book } from '../types';
import BookCard from './BookCard';

interface BookGridProps {
  title: string;
  subtitle?: string;
  books: Book[];
}

const BookGrid: React.FC<BookGridProps> = ({ title, subtitle, books }) => {
  return (
    <div className="container mx-auto px-6 py-24 min-h-screen">
      <div className="text-center mb-16">
        <h2 className="text-4xl md:text-5xl font-poppins font-bold text-gray-900 dark:text-white mb-4 animate-[fadeIn_0.5s_ease-out_forwards]">
            {title}
        </h2>
        {subtitle && (
            <p className="text-gray-600 dark:text-gray-400 text-lg font-inter">{subtitle}</p>
        )}
      </div>

      {books.length === 0 ? (
        <div className="text-center text-gray-500 py-20 bg-white/50 dark:bg-white/5 rounded-3xl border border-gray-200 dark:border-white/5">
            <p>No books found. Try searching or using Mood AI.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {books.map((book, index) => (
                <div 
                    key={book.id} 
                    className="opacity-0 animate-[fadeIn_0.5s_ease-out_forwards]"
                    style={{ animationDelay: `${index * 100}ms` }}
                >
                    <BookCard book={book} />
                </div>
            ))}
        </div>
      )}
    </div>
  );
};

export default BookGrid;