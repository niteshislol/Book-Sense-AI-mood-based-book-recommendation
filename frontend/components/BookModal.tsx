import React, { useEffect } from 'react';
import { Book } from '../types';

interface BookModalProps {
    book: Book | null;
    onClose: () => void;
}

const BookModal: React.FC<BookModalProps> = ({ book, onClose }) => {
    // Prevent background scrolling when modal is open
    useEffect(() => {
        if (book) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
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
                <div className="w-full md:w-3/5 p-8 flex flex-col max-h-[70vh] md:max-h-[90vh] overflow-y-auto">

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

                    <div className="prose dark:prose-invert max-w-none text-gray-600 dark:text-gray-300 leading-relaxed mb-8">
                        <p>{book.description}</p>
                    </div>

                    <div className="mt-auto pt-6 border-t border-gray-200 dark:border-white/10 flex flex-wrap gap-4">
                        <button className="flex-1 bg-gradient-to-r from-[#6f57ff] to-[#5da6ff] text-white py-3 px-6 rounded-xl font-semibold shadow-lg shadow-[#6f57ff]/30 hover:shadow-[#6f57ff]/50 hover:scale-[1.02] transition-all">
                            Start Reading
                        </button>
                        <button className="flex-1 bg-gray-100 dark:bg-white/5 text-gray-900 dark:text-white py-3 px-6 rounded-xl font-semibold hover:bg-gray-200 dark:hover:bg-white/10 transition-all border border-gray-200 dark:border-white/5">
                            Save for Later
                        </button>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default BookModal;
