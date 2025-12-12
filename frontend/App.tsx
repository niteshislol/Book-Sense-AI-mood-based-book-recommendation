import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import BookGrid from './components/BookGrid';
import TopBooks from './components/TopBooks';
import MoodDetector from './components/MoodDetector';
import BookModal from './components/BookModal'; // Import Modal
import { Page, Book, MoodResult } from './types';
import { searchBooks } from './services/api';
import { MOOD_GENRE_MAP } from './constants';

function App() {
  const [page, setPage] = useState<Page>('home');
  const [recommendations, setRecommendations] = useState<Book[]>([]);
  const [searchTitle, setSearchTitle] = useState("Your Recommendations");
  const [searchSubtitle, setSearchSubtitle] = useState("");
  const [selectedBook, setSelectedBook] = useState<Book | null>(null); // Modal State

  // Theme State
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');

  useEffect(() => {
    // Apply theme class to HTML element
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  const handleSearch = async (query: string) => {
    // Keep page as home but set recommendations to populate results below
    setPage('home');
    setSearchTitle(`Results for "${query}"`);
    setSearchSubtitle("Searching the literary universe...");
    setRecommendations([]);

    if (page !== 'home' && page !== 'recommendations') setPage('home');

    const results = await searchBooks(query);
    setRecommendations(results);
    setSearchSubtitle(results.length > 0 ? "Here is what we found for you." : "We couldn't find matches. Try another term.");

    // Scroll to results
    setTimeout(() => {
      const resultsElement = document.getElementById('results-section');
      if (resultsElement) {
        resultsElement.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
  };

  const handleMoodResults = async (moodData?: MoodResult) => {
    setPage('home');
    if (moodData) {
      setSearchTitle(`Mood: ${moodData.mood}`);
      setSearchSubtitle(`Confidence: ${Math.round(moodData.confidence)}% • Genres: ${moodData.suggestedGenres.join(', ')}`);

      const genres = MOOD_GENRE_MAP[moodData.mood] || moodData.suggestedGenres;
      const results = await searchBooks(genres[0] || "");
      setRecommendations(results);

      setTimeout(() => {
        const resultsElement = document.getElementById('results-section');
        if (resultsElement) {
          resultsElement.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    }
  };

  return (
    <div className="min-h-screen font-sans selection:bg-[#6f57ff] selection:text-white transition-colors duration-300">

      <Navbar currentPage={page} setPage={setPage} theme={theme} toggleTheme={toggleTheme} />

      <main>
        {/* Always show Hero on Home or if we have recommendations */}
        {(page === 'home' || page === 'recommendations') && (
          <Hero onSearch={handleSearch} />
        )}

        {page === 'discover' && (
          <div className="pt-24 flex items-center justify-center min-h-screen">
            <div className="text-center">
              <h1 className="text-4xl font-poppins font-bold mb-4 dark:text-white text-gray-900">Discover</h1>
              <p className="text-gray-500 dark:text-gray-400">Advanced filtering coming soon.</p>
              <button onClick={() => setPage('home')} className="mt-4 text-[#6f57ff] hover:underline">Go back home</button>
            </div>
          </div>
        )}

        {/* Show Results Section below Hero */}
        {(page === 'home' || page === 'recommendations') && recommendations.length > 0 && (
          <div id="results-section">
            <BookGrid
              title={searchTitle}
              subtitle={searchSubtitle}
              books={recommendations}
              onBookClick={setSelectedBook} // Pass click handler
            />
          </div>
        )}

        {page === 'top-books' && (
          <TopBooks />
        )}

        {page === 'mood-ai' && (
          <MoodDetector onRecommendationFound={handleMoodResults} />
        )}
      </main>

      {/* Book Modal */}
      <BookModal
        book={selectedBook}
        onClose={() => setSelectedBook(null)}
      />

      {/* Footer */}
      <footer className="py-8 text-center text-gray-500 dark:text-gray-600 text-sm border-t border-gray-200 dark:border-white/5 mt-auto">
        <p>© {new Date().getFullYear()} BookSense AI. Made by Innovators</p>
      </footer>

    </div>
  );
}



export default App;