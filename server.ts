import express from 'express';
import { createServer as createViteServer } from 'vite';
import Database from 'better-sqlite3';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import axios from 'axios';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const db = new Database('music_trend.db');
const JWT_SECRET = process.env.JWT_SECRET || 'super-secret-key';

// Initialize Database
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE,
    password TEXT
  );

  CREATE TABLE IF NOT EXISTS favorites (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    track_id TEXT,
    track_name TEXT,
    artist_name TEXT,
    FOREIGN KEY(user_id) REFERENCES users(id)
  );
`);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // --- Auth Routes ---
  app.post('/api/auth/register', async (req, res) => {
    const { username, password } = req.body;
    try {
      const hashedPassword = await bcrypt.hash(password, 10);
      const stmt = db.prepare('INSERT INTO users (username, password) VALUES (?, ?)');
      stmt.run(username, hashedPassword);
      res.status(201).json({ message: 'User registered' });
    } catch (error) {
      res.status(400).json({ error: 'Username already exists' });
    }
  });

  app.post('/api/auth/login', async (req, res) => {
    const { username, password } = req.body;
    const user = db.prepare('SELECT * FROM users WHERE username = ?').get(username) as any;
    if (user && await bcrypt.compare(password, user.password)) {
      const token = jwt.sign({ id: user.id, username: user.username }, JWT_SECRET);
      res.json({ token, user: { id: user.id, username: user.username } });
    } else {
      res.status(401).json({ error: 'Invalid credentials' });
    }
  });

  // --- Music API Routes ---
  
  // Spotify Token Helper
  let spotifyToken = '';
  let tokenExpiry = 0;

  async function getSpotifyToken() {
    if (spotifyToken && Date.now() < tokenExpiry) return spotifyToken;
    
    const clientId = process.env.SPOTIFY_CLIENT_ID;
    const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;

    if (!clientId || !clientSecret) {
      console.warn('Spotify credentials missing');
      return null;
    }

    const auth = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');
    const response = await axios.post('https://accounts.spotify.com/api/token', 
      'grant_type=client_credentials', 
      {
        headers: {
          'Authorization': `Basic ${auth}`,
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      }
    );
    spotifyToken = response.data.access_token;
    tokenExpiry = Date.now() + (response.data.expires_in * 1000);
    return spotifyToken;
  }

  app.get('/api/music/trending', async (req, res) => {
    try {
      const lastfmKey = process.env.LASTFM_API_KEY;
      if (!lastfmKey) {
        return res.status(500).json({ error: 'Last.fm API key missing' });
      }
      const response = await axios.get(`http://ws.audioscrobbler.com/2.0/?method=chart.gettoptracks&api_key=${lastfmKey}&format=json&limit=10`);
      res.json(response.data.tracks.track);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch trending music' });
    }
  });

  app.get('/api/music/search', async (req, res) => {
    const { q } = req.query;
    const token = await getSpotifyToken();
    if (!token) return res.status(500).json({ error: 'Spotify integration not configured' });

    try {
      const response = await axios.get(`https://api.spotify.com/v1/search?q=${q}&type=track,artist&limit=10`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      res.json(response.data);
    } catch (error) {
      res.status(500).json({ error: 'Search failed' });
    }
  });

  app.get('/api/music/track/:id', async (req, res) => {
    const token = await getSpotifyToken();
    if (!token) return res.status(500).json({ error: 'Spotify integration not configured' });

    try {
      const response = await axios.get(`https://api.spotify.com/v1/tracks/${req.params.id}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      res.json(response.data);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch track' });
    }
  });

  app.get('/api/music/artist/:id', async (req, res) => {
    const token = await getSpotifyToken();
    if (!token) return res.status(500).json({ error: 'Spotify integration not configured' });

    try {
      const artist = await axios.get(`https://api.spotify.com/v1/artists/${req.params.id}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const topTracks = await axios.get(`https://api.spotify.com/v1/artists/${req.params.id}/top-tracks?market=US`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      res.json({ artist: artist.data, topTracks: topTracks.data.tracks });
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch artist' });
    }
  });

  // --- Vite middleware for development ---
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
