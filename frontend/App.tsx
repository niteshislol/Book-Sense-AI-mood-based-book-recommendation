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

    let results = await searchBooks(query);

    // Fallback if no results
    if (results.length === 0) {
      setSearchSubtitle("No exact matches found. Asking gemini for recommendations from the wider world...");
      try {
        const { getFallbackRecommendations } = await import('./services/geminiService');
        results = await getFallbackRecommendations(query);
        setSearchSubtitle(results.length > 0
          ? "We couldn't find exact matches in our library, but here are some AI-generated recommendations."
          : "We couldn't find anything even with AI help. Try another term.");
      } catch (err) {
        console.error("Fallback failed", err);
      }
    } else {
      setSearchSubtitle("Here is what we found for you.");
    }

    setRecommendations(results);

    // Scroll to results
    setTimeout(() => {
      const resultsElement = document.getElementById('results-section');
      if (resultsElement) {
        resultsElement.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
  };

  // Discover Page Logic
  const [discoverBooks, setDiscoverBooks] = useState<Book[]>([]);
  const [loadingDiscover, setLoadingDiscover] = useState(false);

  useEffect(() => {
    if (page === 'discover') {
      const loadDiscover = async () => {
        setLoadingDiscover(true);
        try {
          const history = JSON.parse(localStorage.getItem('readingHistory') || '[]');
          if (history.length === 0) {
            setDiscoverBooks([]);
          } else {
            const { getPersonalizedRecommendations } = await import('./services/geminiService');
            const results = await getPersonalizedRecommendations(history);
            setDiscoverBooks(results);
          }
        } catch (e) {
          console.error(e);
        } finally {
          setLoadingDiscover(false);
        }
      };
      loadDiscover();
    }
  }, [page]);

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
          <div className="pt-24 min-h-screen px-4 md:px-12 pb-12">
            <div className="text-center mb-12">
              <h1 className="text-4xl font-poppins font-bold mb-4 dark:text-white text-gray-900">For You</h1>
              <p className="text-gray-500 dark:text-gray-400">Recommendations based on your reading history.</p>
            </div>

            {loadingDiscover ? (
              <div className="flex flex-col items-center justify-center h-64">
                <div className="w-12 h-12 border-4 border-[#6f57ff] border-t-transparent rounded-full animate-spin mb-4"></div>
                <p className="text-[#6f57ff] animate-pulse">Curating your personal list...</p>
              </div>
            ) : discoverBooks.length > 0 ? (
              <BookGrid
                title="Your Personal Picks"
                subtitle="Based on what you've read recently."
                books={discoverBooks}
                onBookClick={setSelectedBook}
              />
            ) : (
              <div className="text-center py-20 bg-gray-50 dark:bg-white/5 rounded-3xl border border-dashed border-gray-300 dark:border-white/10">
                <div className="text-6xl mb-4">📚</div>
                <h3 className="text-xl font-bold dark:text-white text-gray-900 mb-2">No history yet</h3>
                <p className="text-gray-500 dark:text-gray-400 max-w-md mx-auto mb-6">
                  Start reading books to get personalized recommendations here!
                </p>
                <button
                  onClick={() => setPage('home')}
                  className="bg-[#6f57ff] text-white px-6 py-2 rounded-full hover:bg-[#5da6ff] transition-colors"
                >
                  Browse Books
                </button>
              </div>
            )}
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
          <TopBooks onBookClick={setSelectedBook} />
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