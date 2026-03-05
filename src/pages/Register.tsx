import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authApi } from '../services/api';
import { Music, ArrowRight, Lock, User, CheckCircle } from 'lucide-react';
import { motion } from 'motion/react';

export default function Register() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await authApi.register({ username, password });
      setSuccess(true);
      setTimeout(() => navigate('/login'), 2000);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-brand-dark">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md glass-card"
      >
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-brand-primary/10 text-brand-primary mb-4">
            <Music size={32} />
          </div>
          <h1 className="text-3xl font-display">Create Account</h1>
          <p className="text-zinc-400 mt-2">Join the music analytics community</p>
        </div>

        {success ? (
          <div className="text-center py-10 space-y-4">
            <div className="flex justify-center text-brand-primary">
              <CheckCircle size={64} />
            </div>
            <h2 className="text-2xl">Registration Successful!</h2>
            <p className="text-zinc-400">Redirecting you to login...</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-500/10 border border-red-500/20 text-red-500 p-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            <div className="space-y-2">
              <label className="text-sm font-medium text-zinc-400 flex items-center gap-2">
                <User size={14} /> Username
              </label>
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="input-field w-full"
                placeholder="Choose a username"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-zinc-400 flex items-center gap-2">
                <Lock size={14} /> Password
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input-field w-full"
                placeholder="Create a strong password"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full flex items-center justify-center gap-2"
            >
              {loading ? 'Creating account...' : 'Register'}
              {!loading && <ArrowRight size={18} />}
            </button>
          </form>
        )}

        {!success && (
          <p className="text-center mt-8 text-zinc-500 text-sm">
            Already have an account?{' '}
            <Link to="/login" className="text-brand-primary hover:underline font-bold">
              Sign In
            </Link>
          </p>
        )}
      </motion.div>
    </div>
  );
}
