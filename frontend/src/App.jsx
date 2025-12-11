import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Hero from './components/Hero';
import FilterBar from './components/FilterBar';
import BookCard from './components/BookCard';
import BookModal from './components/BookModal';
import { genres } from './data/mockBooks';

function App() {
  const [selectedGenre, setSelectedGenre] = useState('All');
  const [selectedBook, setSelectedBook] = useState(null);
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);

  // Helper to map backend data to frontend model
  const mapBookData = (apiBook, index, isRecommendation = false) => ({
    id: index,
    title: apiBook.title,
    author: apiBook.author,
    coverUrl: apiBook.image,
    matchScore: isRecommendation ? Math.floor(Math.random() * 10 + 90) : Math.floor(Math.random() * 20 + 75), // Random score
    genre: genres[Math.floor(Math.random() * (genres.length - 1)) + 1], // Random genre from list (skip "All")
    summary: "A compelling read that has captured the attention of many readers.",
    explanation: isRecommendation ? "Recommended based on your search." : "Highly rated by our community."
  });

  const fetchPopularBooks = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://127.0.0.1:5001/popular');
      const data = await response.json();
      const mappedBooks = data.map((b, i) => mapBookData(b, i));
      setBooks(mappedBooks);
    } catch (error) {
      console.error("Failed to fetch popular books:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (query) => {
    if (!query) {
      fetchPopularBooks();
      return;
    }
    setLoading(true);
    try {
      const response = await fetch('http://127.0.0.1:5001/recommend', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ book_name: query })
      });
      if (response.ok) {
        const data = await response.json();
        const mappedBooks = data.map((b, i) => mapBookData(b, i, true));
        setBooks(mappedBooks);
        setSelectedGenre('All'); // Reset filter to show results
      } else {
        console.error("Recommendation failed");
        setBooks([]); // Or handle error UI
      }
    } catch (error) {
      console.error("Search error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPopularBooks();
  }, []);

  const filteredBooks = selectedGenre === 'All'
    ? books
    : books.filter(book => book.genre === selectedGenre);

  return (
    <div className="min-h-screen bg-background text-white selection:bg-primary/30">
      <Hero onSearch={handleSearch} />

      <main className="max-w-7xl mx-auto pb-20">
        <div className="sticky top-0 z-30 bg-background/80 backdrop-blur-xl border-b border-white/5 mb-8">
          <FilterBar
            genres={genres}
            selectedGenre={selectedGenre}
            onSelectGenre={setSelectedGenre}
          />
        </div>

        {loading ? (
          <div className="text-center py-20 text-slate-500">Loading amazing books...</div>
        ) : (
          <motion.div
            layout
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 px-6"
          >
            <AnimatePresence mode='popLayout'>
              {filteredBooks.map((book) => (
                <BookCard
                  key={book.id}
                  book={book}
                  onClick={setSelectedBook}
                />
              ))}
            </AnimatePresence>
          </motion.div>
        )}

        {!loading && filteredBooks.length === 0 && (
          <div className="text-center py-20 text-slate-500">
            No books found.
          </div>
        )}
      </main>

      {selectedBook && (
        <BookModal
          book={selectedBook}
          onClose={() => setSelectedBook(null)}
        />
      )}
    </div>
  );
}

export default App;
