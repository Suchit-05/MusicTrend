import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { musicApi } from '../services/api';
import { Play, Users, Music, Star, Clock, ExternalLink } from 'lucide-react';
import { motion } from 'motion/react';

export default function ArtistDetails() {
  const { id } = useParams<{ id: string }>();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      musicApi.getArtist(id)
        .then(setData)
        .catch(console.error)
        .finally(() => setLoading(false));
    }
  }, [id]);

  if (loading) return <div className="flex justify-center py-20"><div className="animate-spin rounded-full h-10 w-10 border-t-2 border-brand-primary"></div></div>;
  if (!data) return <div className="text-center py-20">Artist not found</div>;

  const { artist, topTracks } = data;

  return (
    <div className="space-y-12 pb-20">
      <div className="relative h-[400px] -mx-6 -mt-10 overflow-hidden">
        <img 
          src={artist.images[0]?.url} 
          alt={artist.name}
          className="w-full h-full object-cover blur-2xl opacity-30 scale-110"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-brand-dark to-transparent" />
        <div className="absolute bottom-10 left-10 flex items-end gap-8">
          <motion.img 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            src={artist.images[0]?.url} 
            alt={artist.name}
            className="w-48 h-48 rounded-full shadow-2xl border-4 border-brand-dark object-cover"
            referrerPolicy="no-referrer"
          />
          <div className="pb-4">
            <div className="flex items-center gap-2 text-blue-400 mb-2">
              <Star size={16} fill="currentColor" />
              <span className="text-xs font-bold uppercase tracking-widest">Verified Artist</span>
            </div>
            <h1 className="text-6xl md:text-8xl mb-4">{artist.name}</h1>
            <div className="flex items-center gap-6 text-zinc-300">
              <div className="flex items-center gap-2">
                <Users size={18} className="text-brand-primary" />
                <span className="font-bold">{artist.followers.total.toLocaleString()}</span>
                <span className="text-zinc-500">Followers</span>
              </div>
              <div className="flex items-center gap-2">
                <Music size={18} className="text-brand-primary" />
                <span className="font-bold">{artist.popularity}%</span>
                <span className="text-zinc-500">Popularity</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2 space-y-10">
          <section>
            <h2 className="text-2xl mb-6">Popular Tracks</h2>
            <div className="space-y-1">
              {topTracks.map((track: any, idx: number) => (
                <motion.div
                  key={track.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className="flex items-center gap-4 p-3 rounded-xl hover:bg-white/5 group transition-colors"
                >
                  <span className="w-6 text-zinc-500 text-center font-mono">{idx + 1}</span>
                  <img src={track.album.images[2]?.url} className="w-10 h-10 rounded" referrerPolicy="no-referrer" />
                  <div className="flex-1 min-w-0">
                    <Link to={`/track/${track.id}`} className="font-bold block truncate hover:underline">
                      {track.name}
                    </Link>
                    <p className="text-xs text-zinc-500">{track.album.name}</p>
                  </div>
                  <div className="flex items-center gap-4 text-zinc-500 text-sm">
                    <Clock size={14} />
                    {Math.floor(track.duration_ms / 60000)}:
                    {String(Math.floor((track.duration_ms % 60000) / 1000)).padStart(2, '0')}
                  </div>
                  <button className="p-2 opacity-0 group-hover:opacity-100 transition-opacity text-brand-primary">
                    <Play fill="currentColor" size={18} />
                  </button>
                </motion.div>
              ))}
            </div>
          </section>
        </div>

        <div className="space-y-10">
          <section className="glass-card">
            <h2 className="text-xl mb-6">About</h2>
            <div className="space-y-6">
              <div>
                <p className="text-xs text-zinc-500 uppercase mb-2">Genres</p>
                <div className="flex flex-wrap gap-2">
                  {artist.genres.map((genre: string) => (
                    <span key={genre} className="px-3 py-1 bg-brand-highlight rounded-full text-xs capitalize">
                      {genre}
                    </span>
                  ))}
                </div>
              </div>
              <a 
                href={artist.external_urls.spotify} 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center justify-between p-4 bg-brand-primary/10 rounded-xl text-brand-primary hover:bg-brand-primary/20 transition-colors"
              >
                <span className="font-bold">Open on Spotify</span>
                <ExternalLink size={18} />
              </a>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
