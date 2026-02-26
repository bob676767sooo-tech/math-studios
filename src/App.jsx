/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, Gamepad2, X, Maximize2, ExternalLink, ChevronLeft, LayoutGrid, Trophy, Zap, Puzzle } from 'lucide-react';
import gamesData from './games.json';

const CATEGORIES = ['All', 'Action', 'Puzzle', 'Sports', 'Idle'];

export default function App() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [activeGame, setActiveGame] = useState(null);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const filteredGames = useMemo(() => {
    return gamesData.filter((game) => {
      const matchesSearch = game.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          game.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === 'All' || game.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, selectedCategory]);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setIsFullscreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
        setIsFullscreen(false);
      }
    }
  };

  return (
    <div className="min-h-screen flex flex-col font-sans">
      {/* Navigation */}
      <nav className="sticky top-0 z-40 glass-card border-b border-white/5 px-6 py-4 flex items-center justify-between">
        <div 
          className="flex items-center gap-2 cursor-pointer group"
          onClick={() => {
            setActiveGame(null);
            setSearchQuery('');
            setSelectedCategory('All');
          }}
        >
          <div className="bg-emerald-500 p-2 rounded-lg group-hover:rotate-12 transition-transform">
            <Gamepad2 className="w-6 h-6 text-black" />
          </div>
          <h1 className="text-xl font-display font-bold tracking-tight">
            UNBLOCKED<span className="text-emerald-500">GAMES</span>
          </h1>
        </div>

        <div className="hidden md:flex items-center bg-zinc-900 border border-white/10 rounded-full px-4 py-2 w-96 focus-within:border-emerald-500/50 transition-colors">
          <Search className="w-4 h-4 text-zinc-500 mr-2" />
          <input
            type="text"
            placeholder="Search games..."
            className="bg-transparent border-none outline-none text-sm w-full"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="flex items-center gap-4">
          <button 
            onClick={toggleFullscreen}
            className="p-2 hover:bg-white/5 rounded-full transition-colors"
            title="Toggle Fullscreen"
          >
            <Maximize2 className="w-5 h-5 text-zinc-400" />
          </button>
        </div>
      </nav>

      <main className="flex-1 container mx-auto px-6 py-8">
        <AnimatePresence mode="wait">
          {!activeGame ? (
            <motion.div
              key="home"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-8"
            >
              {/* Hero Section */}
              <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-600/20 to-zinc-900 border border-emerald-500/20 p-8 md:p-12">
                <div className="relative z-10 max-w-2xl">
                  <h2 className="text-4xl md:text-5xl font-display font-bold mb-4">
                    Play the best games, <br />
                    <span className="text-emerald-500 underline decoration-emerald-500/30 underline-offset-8">anywhere.</span>
                  </h2>
                  <p className="text-zinc-400 text-lg mb-8">
                    A curated collection of unblocked web games. No downloads, no blocks, just pure fun.
                  </p>
                  <div className="flex flex-wrap gap-3">
                    {CATEGORIES.map((cat) => (
                      <button
                        key={cat}
                        onClick={() => setSelectedCategory(cat)}
                        className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${
                          selectedCategory === cat
                            ? 'bg-emerald-500 text-black'
                            : 'bg-zinc-800 hover:bg-zinc-700 text-zinc-300'
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="absolute top-0 right-0 w-1/2 h-full opacity-10 pointer-events-none">
                  <Gamepad2 className="w-full h-full rotate-12 translate-x-1/4" />
                </div>
              </section>

              {/* Mobile Search */}
              <div className="md:hidden flex items-center bg-zinc-900 border border-white/10 rounded-xl px-4 py-3">
                <Search className="w-5 h-5 text-zinc-500 mr-3" />
                <input
                  type="text"
                  placeholder="Search games..."
                  className="bg-transparent border-none outline-none text-base w-full"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              {/* Games Grid */}
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-display font-bold flex items-center gap-2">
                    <LayoutGrid className="w-5 h-5 text-emerald-500" />
                    {selectedCategory === 'All' ? 'Trending Games' : `${selectedCategory} Games`}
                  </h3>
                  <span className="text-sm text-zinc-500">{filteredGames.length} games found</span>
                </div>

                {filteredGames.length > 0 ? (
                  <div className="game-grid">
                    {filteredGames.map((game, index) => (
                      <motion.div
                        key={game.id}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: index * 0.05 }}
                        whileHover={{ y: -8 }}
                        className="group relative glass-card rounded-2xl overflow-hidden cursor-pointer"
                        onClick={() => setActiveGame(game)}
                      >
                        <div className="aspect-[4/3] overflow-hidden">
                          <img
                            src={game.thumbnail}
                            alt={game.title}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                            referrerPolicy="no-referrer"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60 group-hover:opacity-80 transition-opacity" />
                        </div>
                        
                        <div className="absolute bottom-0 left-0 right-0 p-5">
                          <div className="flex items-start justify-between mb-1">
                            <h4 className="text-lg font-bold group-hover:text-emerald-400 transition-colors">{game.title}</h4>
                            <span className="text-[10px] uppercase tracking-wider font-bold bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded border border-emerald-500/30">
                              {game.category}
                            </span>
                          </div>
                          <p className="text-sm text-zinc-400 line-clamp-2 opacity-0 group-hover:opacity-100 transition-opacity transform translate-y-2 group-hover:translate-y-0 duration-300">
                            {game.description}
                          </p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-20 bg-zinc-900/30 rounded-3xl border border-dashed border-white/10">
                    <div className="bg-zinc-800 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Search className="w-8 h-8 text-zinc-500" />
                    </div>
                    <h4 className="text-xl font-bold mb-2">No games found</h4>
                    <p className="text-zinc-500">Try adjusting your search or category filters.</p>
                  </div>
                )}
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="player"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="h-[calc(100vh-160px)] flex flex-col gap-4"
            >
              <div className="flex items-center justify-between">
                <button
                  onClick={() => setActiveGame(null)}
                  className="flex items-center gap-2 text-zinc-400 hover:text-white transition-colors group"
                >
                  <ChevronLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                  Back to Hub
                </button>
                <div className="flex items-center gap-4">
                  <h2 className="text-xl font-display font-bold">{activeGame.title}</h2>
                  <div className="h-4 w-[1px] bg-zinc-800" />
                  <a 
                    href={activeGame.iframeUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="p-2 hover:bg-white/5 rounded-full text-zinc-400 hover:text-emerald-400 transition-colors"
                  >
                    <ExternalLink className="w-5 h-5" />
                  </a>
                </div>
              </div>

              <div className="flex-1 relative glass-card rounded-3xl overflow-hidden shadow-2xl shadow-emerald-500/5">
                <iframe
                  src={activeGame.iframeUrl}
                  className="w-full h-full border-none"
                  title={activeGame.title}
                  allowFullScreen
                  sandbox="allow-forms allow-modals allow-orientation-lock allow-pointer-lock allow-popups allow-popups-to-escape-sandbox allow-presentation allow-same-origin allow-scripts allow-top-navigation-by-user-activation"
                />
              </div>

              <div className="flex items-center justify-between px-2">
                <div className="flex items-center gap-6 text-sm text-zinc-500">
                  <div className="flex items-center gap-2">
                    <Zap className="w-4 h-4 text-yellow-500" />
                    <span>Fast Loading</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Trophy className="w-4 h-4 text-emerald-500" />
                    <span>High Quality</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Puzzle className="w-4 h-4 text-blue-500" />
                    <span>{activeGame.category}</span>
                  </div>
                </div>
                <button 
                  onClick={() => setActiveGame(null)}
                  className="text-zinc-500 hover:text-red-400 transition-colors flex items-center gap-1"
                >
                  <X className="w-4 h-4" />
                  Close Game
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <footer className="glass-card border-t border-white/5 px-6 py-8 mt-auto">
        <div className="container mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <Gamepad2 className="w-5 h-5 text-emerald-500" />
            <span className="font-display font-bold text-sm tracking-widest uppercase">
              Unblocked Games Hub &copy; 2026
            </span>
          </div>
          
          <div className="flex items-center gap-8 text-sm text-zinc-500">
            <a href="#" className="hover:text-emerald-400 transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-emerald-400 transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-emerald-400 transition-colors">Contact</a>
          </div>

          <div className="flex items-center gap-4">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs text-zinc-500 font-mono">ALL SYSTEMS OPERATIONAL</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
