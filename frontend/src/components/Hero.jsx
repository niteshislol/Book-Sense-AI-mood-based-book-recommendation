import React, { useState } from 'react';
import { Search } from 'lucide-react';
import { motion } from 'framer-motion';

const Hero = ({ onSearch }) => {
    const [searchQuery, setSearchQuery] = useState('');
    return (
        <div className="relative py-20 px-6 text-center select-none overflow-hidden">
            {/* Background decoration */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-primary/20 rounded-full blur-3xl -z-10 animate-pulse" />

            <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-4xl md:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-white/70 mb-6"
            >
                Discover Your Next <br />
                <span className="text-primary">Great Read</span>
            </motion.h1>

            <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="text-lg text-slate-400 mb-10 max-w-2xl mx-auto"
            >
                Our AI-powered engine analyzes your reading habits to suggest books you'll actually love.
            </motion.p>

            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 }}
                className="max-w-2xl mx-auto relative group"
            >
                <div className="absolute inset-0 bg-primary/30 rounded-xl blur-lg transition-opacity opacity-0 group-hover:opacity-100" />
                <div className="relative glass rounded-2xl p-2 flex items-center gap-3 transition-all focus-within:ring-2 focus-within:ring-primary/50">
                    <Search className="w-6 h-6 text-slate-400 ml-3" />
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && onSearch(searchQuery)}
                        placeholder="Search by title, author, or interest..."
                        className="flex-1 bg-transparent border-none outline-none text-white placeholder-slate-500 text-lg py-2"
                    />
                    <button
                        onClick={() => onSearch(searchQuery)}
                        className="bg-primary hover:bg-primary/90 text-white px-6 py-2 rounded-xl text-sm font-medium transition-colors"
                    >
                        Smart Search
                    </button>
                </div>
            </motion.div>
        </div>
    );
};

export default Hero;
