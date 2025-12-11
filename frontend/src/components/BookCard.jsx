import React from 'react';
import { motion } from 'framer-motion';
import { Star, BookOpen } from 'lucide-react';

const BookCard = ({ book, onClick }) => {
    return (
        <motion.div
            layout
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            whileHover={{ y: -8, scale: 1.02 }}
            transition={{ duration: 0.3 }}
            className="group relative cursor-pointer"
            onClick={() => onClick(book)}
        >
            <div className="absolute -inset-0.5 bg-gradient-to-r from-primary to-secondary rounded-2xl opacity-0 group-hover:opacity-75 blur transition duration-500" />
            <div className="relative h-full bg-surface rounded-xl overflow-hidden shadow-xl border border-white/5">
                {/* Image Container */}
                <div className="aspect-[2/3] overflow-hidden relative">
                    <img
                        src={book.coverUrl}
                        alt={book.title}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60" />

                    {/* Match Score Badge */}
                    <div className="absolute top-3 right-3 bg-white/10 backdrop-blur-md px-3 py-1 rounded-full border border-white/20 flex items-center gap-1">
                        <span className="text-accent font-bold text-xs">{book.matchScore}% Match</span>
                    </div>

                    {/* View Details Overlay */}
                    <div className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <span className="bg-white text-black px-4 py-2 rounded-full font-medium transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300 flex items-center gap-2">
                            <BookOpen size={16} /> View Details
                        </span>
                    </div>
                </div>

                {/* Content */}
                <div className="p-4">
                    <h3 className="text-lg font-bold text-white mb-1 line-clamp-1">{book.title}</h3>
                    <p className="text-slate-400 text-sm mb-3">{book.author}</p>
                    <div className="flex items-center justify-between">
                        <span className="text-xs px-2 py-1 rounded-md bg-white/5 text-slate-300 border border-white/5">
                            {book.genre}
                        </span>
                        <div className="flex text-yellow-500">
                            {[...Array(5)].map((_, i) => (
                                <Star key={i} size={12} fill="currentColor" className="opacity-80" />
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default BookCard;
