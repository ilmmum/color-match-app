const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

// Setting up the app
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Color Score  The DataBase Schema
const scoreSchema = new mongoose.Schema({
  playerName: String,
  score: Number,
  createdAt: { type: Date, default: Date.now }
});

const Score = mongoose.model('Score', scoreSchema);

// GET - fetch all scores
app.get('/api/scores', async (req, res) => {
  try {
    const scores = await Score.find().sort({ score: -1 });
    res.json({ success: true, data: scores });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch scores' });
  }
});

// POST - save a new score
app.post('/api/scores', async (req, res) => {
  try {
    const { playerName, score } = req.body;
    const newScore = await Score.create({ playerName, score });
    res.status(201).json({ success: true, data: newScore });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to save score' });
  }
});

// Health check
app.get('/health', (req, res) => {
  res.json({ message: 'Color Match server is running!' });
});

// 404 handler
app.use('*splat', (req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// Connect to MongoDB then start server
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('Connected to MongoDB');
    app.listen(PORT, () => {
      console.log(`Color Match server running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error('Database connection error:', error);
    process.exit(1);
  });