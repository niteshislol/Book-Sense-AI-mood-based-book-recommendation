import React from 'react';
import { Book } from '../types';

interface BookCardProps {
  book: Book;
  compact?: boolean;
  onClick?: () => void;
}

const BookCard: React.FC<BookCardProps> = ({ book, compact = false, onClick }) => {
  return (
    <div
      onClick={onClick}
      className={`group relative glass-panel rounded-[20px] overflow-hidden transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl dark:hover:shadow-[0_0_30px_rgba(111,87,255,0.3)] flex flex-col h-full cursor-pointer ${compact ? 'min-w-[160px] w-[160px]' : 'w-full'}`}
    >

      {/* Image Container */}
      <div className={`relative overflow-hidden ${compact ? 'h-48' : 'h-80'} w-full`}>
        <img
          src={book.coverUrl}
          alt={book.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute top-2 right-2 bg-black/60 backdrop-blur-md px-2 py-1 rounded-full flex items-center gap-1">
          <span className="text-yellow-400 text-xs">★</span>
          <span className="text-white text-xs font-bold">
            {typeof book.rating === 'number' ? book.rating.toFixed(1) : book.rating}
          </span>
        </div>

        {/* Genre Badge */}
        <div className="absolute bottom-2 left-2">
          <span className="px-2 py-1 rounded-full text-[10px] uppercase font-bold tracking-wider bg-white/90 dark:bg-white/20 backdrop-blur-md text-gray-900 dark:text-white border border-white/20 shadow-sm">
            {book.genre}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 flex flex-col flex-grow">
        <h3 className={`font-poppins font-bold text-gray-900 dark:text-white mb-1 leading-tight ${compact ? 'text-sm' : 'text-lg'}`}>
          {book.title}
        </h3>
        <p className={`text-gray-600 dark:text-gray-400 font-inter mb-3 ${compact ? 'text-xs' : 'text-sm'}`}>
          {book.author}
        </p>

        {!compact && (
          <p className="text-gray-500 dark:text-gray-300 text-sm font-inter line-clamp-3 mb-4 flex-grow opacity-90 dark:opacity-80">
            {book.description}
          </p>
        )}

        <button className="mt-auto w-full py-2 rounded-xl bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10 text-gray-900 dark:text-white text-sm font-medium transition-all hover:bg-gradient-to-r hover:from-[#6f57ff] hover:to-[#5da6ff] hover:text-white hover:border-transparent hover:shadow-lg">
          View Details
        </button>
      </div>
    </div>
  );
};

export default BookCard;