import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import BookGrid from './components/BookGrid';
import TopBooks from './components/TopBooks';
import MoodDetector from './components/MoodDetector';
import { Page, Book, MoodResult } from './types';
import { searchBooks } from './services/api';
import { MOOD_GENRE_MAP } from './constants';

function App() {
  const [page, setPage] = useState<Page>('home');
  const [recommendations, setRecommendations] = useState<Book[]>([]);
  const [searchTitle, setSearchTitle] = useState("Your Recommendations");
  const [searchSubtitle, setSearchSubtitle] = useState("");

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
    setPage('home'); // Or keep it 'recommendations' if we want to highlight nav, but user wants "same page" feel
    setSearchTitle(`Results for "${query}"`);
    setSearchSubtitle("Searching the literary universe...");
    setRecommendations([]); // Clear previous

    // If not already on home/recommendations, switch to home
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
    // Similar logic for mood
    setPage('home');
    if (moodData) {
      setSearchTitle(`Mood: ${moodData.mood}`);
      setSearchSubtitle(`Confidence: ${Math.round(moodData.confidence)}% • Genres: ${moodData.suggestedGenres.join(', ')}`);

      const genres = MOOD_GENRE_MAP[moodData.mood] || moodData.suggestedGenres;
      const results = await searchBooks(genres[0] || "");
      setRecommendations(results);

      // Scroll to results
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
        {/* Always show Hero on Home or if we have recommendations (which acts as an extension of Home) */}
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

        {/* Show Results Section below Hero if we have recommendations or explicitly on recommendations page */}
        {(page === 'home' || page === 'recommendations') && recommendations.length > 0 && (
          <div id="results-section">
            <BookGrid
              title={searchTitle}
              subtitle={searchSubtitle}
              books={recommendations}
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

      {/* Footer */}
      <footer className="py-8 text-center text-gray-500 dark:text-gray-600 text-sm border-t border-gray-200 dark:border-white/5 mt-auto">
        <p>© {new Date().getFullYear()} BookSense AI. Powered by Google Gemini.</p>
      </footer>

    </div>
  );
}

export default App;