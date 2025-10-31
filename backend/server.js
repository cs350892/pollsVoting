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
app.use(cors({
  origin: [ "http://localhost:5173"],
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true,
}));

app.use(express.json());
app.use(cors());
app.use(express.json());

app.use('/api/auth', (await import('./routes/auth.js')).default);
app.use('/api/polls', (await import('./routes/polls.js')).default);
app.use('/api/votes', (await import('./routes/votes.js')).default);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
