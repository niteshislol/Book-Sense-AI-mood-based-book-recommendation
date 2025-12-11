import React from 'react';
import { motion } from 'framer-motion';

const FilterBar = ({ genres, selectedGenre, onSelectGenre }) => {
    return (
        <div className="w-full overflow-x-auto py-6 px-6 no-scrollbar">
            <div className="flex gap-3 min-w-max mx-auto md:justify-center">
                {genres.map((genre, index) => (
                    <motion.button
                        key={genre}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                        onClick={() => onSelectGenre(genre)}
                        className={`
              relative px-6 py-2 rounded-full text-sm font-medium transition-all
              ${selectedGenre === genre
                                ? 'text-white'
                                : 'text-slate-400 hover:text-white bg-surface/50 border border-white/5 hover:border-white/20'}
            `}
                    >
                        {selectedGenre === genre && (
                            <motion.div
                                layoutId="activeFilter"
                                className="absolute inset-0 bg-primary rounded-full -z-10"
                                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                            />
                        )}
                        {genre}
                    </motion.button>
                ))}
            </div>
        </div>
    );
};

export default FilterBar;
