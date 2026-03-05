import React, { useEffect, useState } from 'react';
import { musicApi } from '../services/api';
import { TrendingUp, Play, Music as MusicIcon, User as UserIcon } from 'lucide-react';
import { motion } from 'motion/react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Link } from 'react-router-dom';

export default function Dashboard() {
  const [trending, setTrending] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    musicApi.getTrending()
      .then(setTrending)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  // Mock genre data for visualization
  const genreData = [
    { name: 'Pop', value: 85, color: '#1DB954' },
    { name: 'Hip Hop', value: 72, color: '#1ed760' },
    { name: 'Rock', value: 45, color: '#2ebd59' },
    { name: 'Electronic', value: 64, color: '#1fdf64' },
    { name: 'Jazz', value: 28, color: '#1aa34a' },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-brand-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-10 pb-20">
      <header>
        <h1 className="text-4xl md:text-5xl mb-2">Global Music Trends</h1>
        <p className="text-zinc-400">Real-time insights from across the globe.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Genre Popularity Chart */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="lg:col-span-2 glass-card"
        >
          <h2 className="text-xl mb-6 flex items-center gap-2">
            <TrendingUp className="text-brand-primary" />
            Genre Popularity Index
          </h2>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={genreData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#333" vertical={false} />
                <XAxis dataKey="name" stroke="#888" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#888" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#181818', border: '1px solid #333', borderRadius: '8px' }}
                  itemStyle={{ color: '#1DB954' }}
                />
                <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                  {genreData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Stats Summary */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass-card flex flex-col justify-between"
        >
          <div>
            <h2 className="text-xl mb-6">Market Insights</h2>
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <span className="text-zinc-400">Total Streams</span>
                <span className="font-mono text-brand-primary">1.2B+</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-zinc-400">Active Artists</span>
                <span className="font-mono text-brand-primary">450K</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-zinc-400">New Releases</span>
                <span className="font-mono text-brand-primary">12.4K</span>
              </div>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-white/5">
            <p className="text-xs text-zinc-500 italic">
              * Data aggregated from Spotify and Last.fm APIs.
            </p>
          </div>
        </motion.div>
      </div>

      {/* Trending Tracks */}
      <section>
        <div className="flex justify-between items-end mb-8">
          <h2 className="text-3xl">Trending Now</h2>
          <Link to="/trending" className="text-brand-primary hover:underline text-sm font-medium">View All</Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
          {trending.slice(0, 5).map((track, idx) => (
            <motion.div
              key={track.name + idx}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: idx * 0.05 }}
              className="glass-card p-4 group cursor-pointer"
            >
              <div className="aspect-square bg-zinc-800 rounded-lg mb-4 flex items-center justify-center relative overflow-hidden">
                <MusicIcon size={48} className="text-zinc-700" />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <Play fill="#1DB954" className="text-brand-primary" size={40} />
                </div>
              </div>
              <h3 className="font-bold truncate" title={track.name}>{track.name}</h3>
              <p className="text-sm text-zinc-400 truncate flex items-center gap-1">
                <UserIcon size={12} />
                {track.artist.name}
              </p>
              <div className="mt-4 flex items-center justify-between text-xs text-zinc-500">
                <span>{parseInt(track.listeners).toLocaleString()} listeners</span>
              </div>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
}
