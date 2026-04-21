const express = require('express');
const cors = require('cors');
require('dotenv').config();

const { errorMiddleware } = require('./middleware/errorMiddleware');

// Import routes
const emergencyRoutes = require('./routes/emergencyRoutes');
const aiRoutes = require('./routes/aiRoutes');
const sosRoutes = require('./routes/sosRoutes');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'API is running',
    timestamp: new Date(),
  });
});

// API Routes
app.use('/api/emergency', emergencyRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/sos', sosRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
  });
});

// Error handling middleware (must be last)
app.use(errorMiddleware);

module.exports = app;
