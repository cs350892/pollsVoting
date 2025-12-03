import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import connectDB from './config/db.js';
import { fileURLToPath } from 'url';
import path from 'path';

// ESM-safe __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

await connectDB();

const app = express();

// CORS Configuration
const allowedOrigins = process.env.NODE_ENV === 'production' 
  ? (process.env.FRONTEND_URL || '').split(',').filter(Boolean)
  : ["http://localhost:5173", "http://localhost:3000"];

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (mobile apps, Postman, etc.)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.includes(origin) || process.env.NODE_ENV !== 'production') {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true,
}));

app.use(express.json());

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', message: 'Backend API is running' });
});

// Root endpoint
app.get('/', (req, res) => {
  res.json({ 
    message: 'Polls Voting API', 
    version: '1.0.0',
    endpoints: {
      auth: '/api/auth',
      polls: '/api/polls',
      votes: '/api/votes'
    }
  });
});

// API Routes
app.use('/api/auth', (await import('./routes/auth.js')).default);
app.use('/api/polls', (await import('./routes/polls.js')).default);
app.use('/api/votes', (await import('./routes/votes.js')).default);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
