import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Book, Heart, Share2 } from 'lucide-react';

const BookModal = ({ book, onClose }) => {
    if (!book) return null;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                {/* Backdrop */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={onClose}
                    className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                />

                {/* Modal */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.9, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9, y: 20 }}
                    className="relative w-full max-w-4xl bg-surface/90 backdrop-blur-xl rounded-3xl border border-white/10 shadow-2xl overflow-hidden flex flex-col md:flex-row max-h-[90vh]"
                >
                    {/* Close Button */}
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 z-10 p-2 bg-black/20 hover:bg-black/40 rounded-full text-white transition-colors"
                    >
                        <X size={20} />
                    </button>

                    {/* Left: Image Side */}
                    <div className="w-full md:w-2/5 p-6 md:p-8 bg-black/20 flex items-center justify-center">
                        <div className="relative aspect-[2/3] w-48 md:w-full max-w-[280px] shadow-2xl rounded-lg overflow-hidden transform rotate-2 hover:rotate-0 transition-transform duration-500">
                            <img
                                src={book.coverUrl}
                                alt={book.title}
                                className="w-full h-full object-cover"
                            />
                        </div>
                    </div>

                    {/* Right: Content Side */}
                    <div className="w-full md:w-3/5 p-6 md:p-10 flex flex-col overflow-y-auto">
                        <div className="flex items-center gap-2 text-accent text-sm font-bold mb-3 tracking-wide uppercase">
                            <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
                            {book.matchScore}% Match
                        </div>

                        <h2 className="text-3xl md:text-4xl font-bold text-white mb-2">{book.title}</h2>
                        <p className="text-xl text-slate-400 mb-6">{book.author}</p>

                        <div className="space-y-6">
                            <div className="bg-white/5 rounded-xl p-5 border border-white/5">
                                <h4 className="text-sm font-medium text-slate-300 mb-2 uppercase tracking-wider">Why we picked this</h4>
                                <p className="text-slate-200 leading-relaxed italic border-l-2 border-primary pl-4">
                                    "{book.explanation}"
                                </p>
                            </div>

                            <div>
                                <h4 className="text-sm font-medium text-slate-300 mb-2 uppercase tracking-wider">Summary</h4>
                                <p className="text-slate-400 leading-relaxed">
                                    {book.summary}
                                </p>
                            </div>

                            <div className="flex gap-4 pt-4 mt-auto">
                                <button className="flex-1 bg-primary hover:bg-primary/90 text-white py-3 px-6 rounded-xl font-bold transition-all shadow-lg shadow-primary/25 flex items-center justify-center gap-2">
                                    <Book size={18} /> Start Reading
                                </button>
                                <button className="p-3 bg-white/5 hover:bg-white/10 text-white rounded-xl border border-white/10 transition-colors">
                                    <Heart size={20} />
                                </button>
                                <button className="p-3 bg-white/5 hover:bg-white/10 text-white rounded-xl border border-white/10 transition-colors">
                                    <Share2 size={20} />
                                </button>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
};

export default BookModal;
