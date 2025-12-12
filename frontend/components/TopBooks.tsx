import React, { useEffect, useState } from 'react';
import { Book } from '../types';
import { MOCK_BOOKS } from '../constants';
import BookCard from './BookCard';
import { getPopularBooks } from '../services/api';

interface TopBooksProps {
  onBookClick?: (book: Book) => void;
}

const TopBooks: React.FC<TopBooksProps> = ({ onBookClick }) => {
  const [trending, setTrending] = useState<Book[]>([]);

  useEffect(() => {
    const fetchTrending = async () => {
      // Fetch from local backend
      const popular = await getPopularBooks();
      if (popular.length > 0) setTrending(popular);
      else setTrending(MOCK_BOOKS.slice(0, 4)); // Fallback if backend fails
    };
    fetchTrending();
  }, []);

  return (
    <div className="container mx-auto px-6 py-24 min-h-screen">

      {/* Top 10 Horizontal Scroll */}
      <section className="mb-20">
        <div className="flex justify-between items-end mb-8">
          <div>
            <h2 className="text-3xl font-poppins font-bold text-gray-900 dark:text-white mb-2">Top 10 All Time</h2>
            <p className="text-gray-600 dark:text-gray-400">Masterpieces everyone should read.</p>
          </div>
          <div className="flex gap-2">
            <button className="w-10 h-10 rounded-full border border-gray-300 dark:border-white/20 flex items-center justify-center text-gray-600 dark:text-white hover:bg-black/5 dark:hover:bg-white/10 transition">←</button>
            <button className="w-10 h-10 rounded-full border border-gray-300 dark:border-white/20 flex items-center justify-center text-gray-600 dark:text-white hover:bg-black/5 dark:hover:bg-white/10 transition">→</button>
          </div>
        </div>

        <div className="flex overflow-x-auto gap-6 pb-8 snap-x hide-scrollbar">
          {MOCK_BOOKS.concat(MOCK_BOOKS).map((book, i) => (
            <div key={i} className="min-w-[280px] snap-center">
              <BookCard book={{ ...book, id: `top-${i}` }} onClick={() => onBookClick && onBookClick(book)} />
            </div>
          ))}
        </div>
      </section>

      {/* Trending AI Section */}
      <section className="mb-20">
        <h2 className="text-3xl font-poppins font-bold text-gradient mb-8 inline-block">AI Trending Now</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {trending.map((book) => (
            <BookCard key={book.id} book={book} onClick={() => onBookClick && onBookClick(book)} />
          ))}
        </div>
      </section>

      {/* Top 50 Grid (Partial) */}
      <section>
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-poppins font-bold text-gray-900 dark:text-white">Top 50 Curated</h2>
          <select className="bg-white/50 dark:bg-white/5 border border-gray-300 dark:border-white/20 text-gray-800 dark:text-white rounded-lg px-4 py-2 outline-none">
            <option>Sort by Rating</option>
            <option>Sort by Popularity</option>
            <option>Sort by Year</option>
          </select>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
          {MOCK_BOOKS.concat(MOCK_BOOKS).concat(MOCK_BOOKS).slice(0, 10).map((book, i) => (
            <div key={i} className="transform hover:-translate-y-2 transition-transform duration-300">
              <BookCard book={{ ...book, id: `top50-${i}` }} compact onClick={() => onBookClick && onBookClick(book)} />
            </div>
          ))}
        </div>
        <div className="mt-12 text-center">
          <button className="px-8 py-3 rounded-full border border-[#6f57ff] text-[#6f57ff] hover:bg-[#6f57ff] hover:text-white transition-all font-semibold">Load More</button>
        </div>
      </section>

    </div>
  );
};

export default TopBooks;