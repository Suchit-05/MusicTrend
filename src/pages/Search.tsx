import React, { useState } from 'react';
import { musicApi } from '../services/api';
import { Search as SearchIcon, Music, User, Play, Clock } from 'lucide-react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';

export default function Search() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    try {
      const data = await musicApi.search(query);
      setResults(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-10 pb-20">
      <header className="max-w-2xl">
        <h1 className="text-4xl mb-4">Search Music</h1>
        <form onSubmit={handleSearch} className="relative">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search for tracks or artists..."
            className="w-full h-14 bg-brand-highlight rounded-full pl-14 pr-6 text-lg focus:ring-2 focus:ring-brand-primary outline-none transition-all"
          />
          <SearchIcon className="absolute left-5 top-1/2 -translate-y-1/2 text-zinc-500" size={24} />
          <button 
            type="submit"
            className="absolute right-2 top-1/2 -translate-y-1/2 bg-brand-primary text-black font-bold px-6 py-2 rounded-full hover:brightness-110 transition-all"
          >
            Search
          </button>
        </form>
      </header>

      {loading && (
        <div className="flex justify-center py-20">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-brand-primary"></div>
        </div>
      )}

      {results && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Tracks Results */}
          <section>
            <h2 className="text-2xl mb-6 flex items-center gap-2">
              <Music className="text-brand-primary" />
              Tracks
            </h2>
            <div className="space-y-2">
              {results.tracks.items.map((track: any, idx: number) => (
                <motion.div
                  key={track.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className="flex items-center gap-4 p-3 rounded-xl hover:bg-white/5 group transition-colors"
                >
                  <img 
                    src={track.album.images[2]?.url || 'https://picsum.photos/seed/music/64/64'} 
                    alt={track.name}
                    className="w-12 h-12 rounded-md object-cover"
                    referrerPolicy="no-referrer"
                  />
                  <div className="flex-1 min-w-0">
                    <Link to={`/track/${track.id}`} className="font-bold block truncate hover:underline">
                      {track.name}
                    </Link>
                    <p className="text-sm text-zinc-400 truncate">
                      {track.artists.map((a: any) => a.name).join(', ')}
                    </p>
                  </div>
                  <div className="flex items-center gap-4 text-zinc-500 text-sm">
                    <Clock size={14} />
                    {Math.floor(track.duration_ms / 60000)}:
                    {String(Math.floor((track.duration_ms % 60000) / 1000)).padStart(2, '0')}
                  </div>
                  <button className="p-2 opacity-0 group-hover:opacity-100 transition-opacity text-brand-primary">
                    <Play fill="currentColor" size={20} />
                  </button>
                </motion.div>
              ))}
            </div>
          </section>

          {/* Artists Results */}
          <section>
            <h2 className="text-2xl mb-6 flex items-center gap-2">
              <User className="text-brand-primary" />
              Artists
            </h2>
            <div className="grid grid-cols-2 gap-4">
              {results.artists.items.map((artist: any, idx: number) => (
                <motion.div
                  key={artist.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: idx * 0.05 }}
                  className="glass-card p-4 flex flex-col items-center text-center group cursor-pointer"
                >
                  <Link to={`/artist/${artist.id}`} className="w-full">
                    <img 
                      src={artist.images[1]?.url || 'https://picsum.photos/seed/artist/160/160'} 
                      alt={artist.name}
                      className="w-32 h-32 rounded-full object-cover mb-4 mx-auto shadow-xl group-hover:scale-105 transition-transform"
                      referrerPolicy="no-referrer"
                    />
                    <h3 className="font-bold truncate">{artist.name}</h3>
                    <p className="text-xs text-zinc-500 mt-1 uppercase tracking-wider">
                      {artist.genres[0] || 'Artist'}
                    </p>
                  </Link>
                </motion.div>
              ))}
            </div>
          </section>
        </div>
      )}
    </div>
  );
}
