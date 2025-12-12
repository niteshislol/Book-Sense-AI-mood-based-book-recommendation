import React, { useEffect, useState } from 'react';
import { Book } from '../types';
import { generateBookSummary } from '../services/geminiService';

interface BookModalProps {
    book: Book | null;
    onClose: () => void;
}

const BookModal: React.FC<BookModalProps> = ({ book, onClose }) => {
    const [summary, setSummary] = useState<string | null>(null);
    const [price, setPrice] = useState<{ inr: string; usd: string } | null>(null);
    const [loadingSummary, setLoadingSummary] = useState(false);
    const [loadingPrice, setLoadingPrice] = useState(false);

    // Prevent background scrolling when modal is open
    useEffect(() => {
        if (book) {
            document.body.style.overflow = 'hidden';

            // Initial states
            const needsSummary = book.description === "Description unavailable in local dataset." || !book.description;
            setLoadingSummary(needsSummary);
            setLoadingPrice(true);
            setSummary(null);
            setPrice(null);

            // Always generate insights (price is needed, and summary might be better)
            generateBookSummary(book.title, book.author)
                .then(result => {
                    if (result) {
                        setSummary(result.summary);
                        setPrice(result.price);
                    } else {
                        if (needsSummary) setSummary("Could not generate summary.");
                    }
                })
                .catch(() => {
                    if (needsSummary) setSummary("Could not generate summary.");
                })
                .finally(() => {
                    setLoadingSummary(false);
                    setLoadingPrice(false);
                });

        } else {
            document.body.style.overflow = 'unset';
            setSummary(null);
            setPrice(null);
            setLoadingSummary(false);
            setLoadingPrice(false);
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [book]);

    if (!book) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300"
                onClick={onClose}
            ></div>

            {/* Modal Content */}
            <div className="relative w-full max-w-4xl bg-white dark:bg-[#0b0e16] rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row animate-[fadeIn_0.3s_ease-out_forwards] border border-white/20">

                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 z-10 p-2 rounded-full bg-black/20 dark:bg-white/10 text-white hover:bg-black/40 dark:hover:bg-white/20 transition-colors backdrop-blur-md"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>

                {/* Image Section */}
                <div className="w-full md:w-2/5 h-64 md:h-auto relative">
                    <img
                        src={book.coverUrl}
                        alt={book.title}
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent md:bg-gradient-to-r md:from-transparent md:to-black/50"></div>
                </div>

                {/* Details Section */}
                <div className="w-full md:w-3/5 p-8 flex flex-col max-h-[70vh] md:max-h-[90vh] overflow-y-auto custom-scrollbar">

                    <div className="mb-2 flex items-center justify-between">
                        <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-[#6f57ff]/10 text-[#6f57ff] border border-[#6f57ff]/20">
                            {book.genre}
                        </span>
                        <div className="flex items-center gap-1">
                            <span className="text-yellow-400 text-lg">★</span>
                            <span className="font-bold text-gray-900 dark:text-white">{book.rating}</span>
                        </div>
                    </div>

                    <h2 className="text-3xl md:text-4xl font-poppins font-bold text-gray-900 dark:text-white mb-2 leading-tight">
                        {book.title}
                    </h2>

                    <p className="text-lg text-gray-600 dark:text-gray-400 font-medium mb-6">
                        by {book.author} <span className="text-gray-400 dark:text-gray-600">• {book.year}</span>
                    </p>

                    <div className="prose dark:prose-invert max-w-none text-gray-600 dark:text-gray-300 leading-relaxed mb-8 relative min-h-[100px]">
                        {loadingSummary ? (
                            <div className="flex flex-col gap-2 animate-pulse">
                                <div className="h-4 bg-gray-200 dark:bg-white/10 rounded w-3/4"></div>
                                <div className="h-4 bg-gray-200 dark:bg-white/10 rounded w-full"></div>
                                <div className="h-4 bg-gray-200 dark:bg-white/10 rounded w-5/6"></div>
                                <p className="text-sm text-[#6f57ff] font-medium mt-2">✨ Generating Summary...</p>
                            </div>
                        ) : (
                            <p>{summary || book.description}</p>
                        )}
                    </div>

                    <div className="mt-auto pt-6 border-t border-gray-200 dark:border-white/10 flex flex-wrap gap-4 items-center justify-between">
                        {loadingPrice ? (
                            // Loading State
                            <div className="w-full h-12 bg-gray-100 dark:bg-white/5 rounded-xl animate-pulse flex items-center justify-center text-gray-400 text-sm">
                                Loading prices...
                            </div>
                        ) : price ? (
                            // Price available
                            <div className="flex flex-col w-full">
                                <p className="text-sm text-gray-500 dark:text-gray-400 mb-1 font-medium">Estimated Price</p>
                                <div className="flex items-center gap-4">
                                    <div className="px-4 py-2 bg-green-500/10 border border-green-500/20 rounded-xl text-green-600 dark:text-green-400 font-bold">
                                        🇮🇳 {price.inr}
                                    </div>
                                    <div className="px-4 py-2 bg-blue-500/10 border border-blue-500/20 rounded-xl text-blue-600 dark:text-blue-400 font-bold">
                                        🇺🇸 {price.usd}
                                    </div>
                                </div>
                            </div>
                        ) : (
                            // Fallback if no price available
                            <div className="w-full h-12 flex items-center justify-center text-gray-400 text-sm italic">
                                Price info unavailable
                            </div>
                        )}
                    </div>

                    <button
                        onClick={() => {
                            // Save to local storage
                            const history = JSON.parse(localStorage.getItem('readingHistory') || '[]');
                            if (!history.find((b: string) => b === book.title)) {
                                history.push(book.title);
                                localStorage.setItem('readingHistory', JSON.stringify(history));
                            }
                            window.open(`https://www.google.com/search?q=${encodeURIComponent(book.title + " book")}`, '_blank');
                        }}
                        className="mt-4 w-full bg-gradient-to-r from-[#6f57ff] to-[#5da6ff] text-white py-3 px-6 rounded-xl font-semibold shadow-lg shadow-[#6f57ff]/30 hover:shadow-[#6f57ff]/50 hover:scale-[1.02] transition-all"
                    >
                        Start Reading
                    </button>

                </div>
            </div>
        </div>
    );
};

export default BookModal;
