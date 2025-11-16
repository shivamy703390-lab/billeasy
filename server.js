const path = require('path');
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const mongoose = require('mongoose');

const app = express();

// View engine: EJS and views directory
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'src', 'views'));

// MongoDB: connect via env MONGO_URI (Atlas) or local fallback
const mongoUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/billeasy';
mongoose
  .connect(mongoUri, { serverSelectionTimeoutMS: 8000 })
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err.message));

// DB health endpoint
app.get('/api/health', (req, res) => {
  const state = mongoose.connection?.readyState; // 0=disconnected,1=connected,2=connecting,3=disconnecting
  res.json({ success: true, db: { connected: state === 1, state } });
});

// Core middleware
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// Static files: serves your billeasy.html and assets
const publicDir = path.join(__dirname, 'public');
app.use(express.static(publicDir));

// API routes: REMOVE if ./src/routes/api.routes.js does not exist (it causes a crash)
const apiRoutes = require('./src/routes/api.routes');
app.use('/api', apiRoutes);

// INSERT: products, events, and gst routes (ensure all files exist)
const productRoutes = require('./src/routes/products.routes');
const eventRoutes = require('./src/routes/events.routes');
const gstRoutes = require('./src/routes/gst.routes'); // -- added require

// INSERT: auth routes (fixes "API route not found" for /api/auth/login)
const authRoutes = require('./src/routes/auth.routes');

app.use('/api/products', productRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/gst', gstRoutes);
app.use('/api/auth', authRoutes); // -- mount auth

// Pages
app.get('/', (req, res) => {
  const publicDir = path.join(__dirname, 'public');
  res.sendFile(path.join(publicDir, 'billeasy.html'));
});

app.get('/products', (req, res) => {
  res.render('pages/products', { title: 'Products' });
});

app.get('/events', (req, res) => {
  res.render('pages/events', { title: 'Events' });
});

app.get('/about', (req, res) => {
  res.render('pages/about', { title: 'About' });
});

// 404 for API
app.use('/api/*', (req, res) => {
  res.status(404).json({ success: false, error: 'API route not found' });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(err.status || 500).json({ success: false, error: err.message || 'Internal Server Error' });
});

// Auto-retry start to handle EADDRINUSE port conflicts
const BASE_PORT = Number(process.env.PORT) || 3000;
function start(port, triesLeft = 5) {
  const server = app.listen(port, () => console.log(`BillEasy server running at http://localhost:${port}`));
  server.on('error', (err) => {
    if (err.code === 'EADDRINUSE' && triesLeft > 0) {
      console.warn(`Port ${port} is in use. Trying ${port + 1}...`);
      start(port + 1, triesLeft - 1);
    } else {
      console.error('Failed to start server:', err);
    }
  });
}
start(BASE_PORT);
