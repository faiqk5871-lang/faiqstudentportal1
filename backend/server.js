require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const sequelize = require('./config/database');
const User = require('./models/User');
const Application = require('./models/Application');
const Announcement = require('./models/Announcement');
const authRoutes = require('./routes/auth');
const appRoutes = require('./routes/applications');
const announcementRoutes = require('./routes/announcements');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:5000'], 
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Serve static files (uploads & frontend)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use(express.static(path.join(__dirname, '..'))); // Serve frontend

// Routes
app.use('/api', authRoutes);
app.use('/api/applications', appRoutes);
app.use('/api/announcements', announcementRoutes);

// Health check
app.get('/api/health', (req, res) => res.json({ success: true, message: 'Backend running' }));

// Sync DB and start server
const startServer = async () => {
  try {
    await sequelize.authenticate();
    console.log('SQLite connected successfully');
    
    // Sync models (force: false for dev)
    await sequelize.sync({ alter: true });
    console.log('Database synced');
    
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`Server running on port ${PORT}`);
      console.log(`Frontend: http://localhost:${PORT}`);
      console.log(`API: http://localhost:${PORT}/api/health`);
    });
  } catch (error) {
    console.error('Failed to start:', error);
  }
};

startServer();

module.exports = app;
