import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { musicApi } from '../services/api';
import { Play, Clock, Calendar, Disc, User, Heart } from 'lucide-react';
import { motion } from 'motion/react';

export default function TrackDetails() {
  const { id } = useParams<{ id: string }>();
  const [track, setTrack] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      musicApi.getTrack(id)
        .then(setTrack)
        .catch(console.error)
        .finally(() => setLoading(false));
    }
  }, [id]);

  if (loading) return <div className="flex justify-center py-20"><div className="animate-spin rounded-full h-10 w-10 border-t-2 border-brand-primary"></div></div>;
  if (!track) return <div className="text-center py-20">Track not found</div>;

  return (
    <div className="space-y-12 pb-20">
      <div className="flex flex-col md:flex-row gap-8 items-end">
        <motion.img 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          src={track.album.images[0]?.url} 
          alt={track.name}
          className="w-64 h-64 rounded-xl shadow-2xl"
          referrerPolicy="no-referrer"
        />
        <div className="flex-1">
          <p className="text-xs uppercase tracking-widest text-zinc-400 font-bold mb-2">Single</p>
          <h1 className="text-5xl md:text-7xl mb-6">{track.name}</h1>
          <div className="flex items-center gap-4 text-zinc-300">
            <div className="flex items-center gap-2">
              <User size={18} className="text-brand-primary" />
              {track.artists.map((a: any, i: number) => (
                <React.Fragment key={a.id}>
                  <Link to={`/artist/${a.id}`} className="hover:underline font-bold">{a.name}</Link>
                  {i < track.artists.length - 1 && ", "}
                </React.Fragment>
              ))}
            </div>
            <span className="text-zinc-600">•</span>
            <div className="flex items-center gap-2">
              <Disc size={18} />
              <span className="text-zinc-400">{track.album.name}</span>
            </div>
            <span className="text-zinc-600">•</span>
            <div className="flex items-center gap-2">
              <Calendar size={18} />
              <span className="text-zinc-400">{track.album.release_date.split('-')[0]}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="flex gap-4">
        <button className="btn-primary flex items-center gap-2">
          <Play fill="currentColor" size={20} /> Play Track
        </button>
        <button className="p-3 rounded-full border border-white/10 hover:bg-white/5 transition-colors text-zinc-400 hover:text-red-500">
          <Heart size={24} />
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <section className="glass-card">
            <h2 className="text-xl mb-6">Audio Features</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {[
                { label: 'Popularity', value: track.popularity + '%' },
                { label: 'Explicit', value: track.explicit ? 'Yes' : 'No' },
                { label: 'Duration', value: `${Math.floor(track.duration_ms / 60000)}:${String(Math.floor((track.duration_ms % 60000) / 1000)).padStart(2, '0')}` },
                { label: 'Disc #', value: track.disc_number },
              ].map((stat) => (
                <div key={stat.label}>
                  <p className="text-xs text-zinc-500 uppercase mb-1">{stat.label}</p>
                  <p className="text-xl font-display">{stat.value}</p>
                </div>
              ))}
            </div>
          </section>
        </div>

        <div className="space-y-8">
          <section className="glass-card">
            <h2 className="text-xl mb-6">Album Info</h2>
            <div className="flex items-center gap-4 mb-6">
              <img src={track.album.images[2]?.url} className="w-16 h-16 rounded-lg" referrerPolicy="no-referrer" />
              <div>
                <p className="font-bold">{track.album.name}</p>
                <p className="text-sm text-zinc-400">{track.album.total_tracks} tracks</p>
              </div>
            </div>
            <Link to={`/search?q=${track.album.name}`} className="text-brand-primary text-sm hover:underline">View full album</Link>
          </section>
        </div>
      </div>
    </div>
  );
}
