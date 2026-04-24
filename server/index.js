require('dotenv').config();
const express    = require('express');
const cors       = require('cors');
const { clerkMiddleware } = require('@clerk/express');
const sequelize  = require('./config/database');
require('./models'); // load models and register associations

const authRouter     = require('./routes/auth');
const ridersRouter   = require('./routes/riders');
const driversRouter  = require('./routes/drivers');
const ridesRouter    = require('./routes/rides');
const paymentsRouter = require('./routes/payments');

const app  = express();
const PORT = process.env.PORT || 3001;

// ─── Middleware ───────────────────────────────────────────────────────────────
app.use(cors({
  origin: process.env.CLIENT_ORIGIN || 'http://localhost:5173',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.use(express.json());
app.use(clerkMiddleware({ publishableKey: process.env.CLERK_PUBLISHABLE_KEY }));

// ─── Routes ──────────────────────────────────────────────────────────────────
app.get('/', (_req, res) => {
  res.json({ message: 'RideFlow API is running 🚗', version: '1.0.0' });
});

app.use('/api/auth',     authRouter);
app.use('/api/riders',   ridersRouter);
app.use('/api/drivers',  driversRouter);
app.use('/api/rides',    ridesRouter);
app.use('/api/payments', paymentsRouter);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ success: false, message: `Route ${req.originalUrl} not found` });
});

// Global error handler
app.use((err, _req, res, _next) => {
  console.error(err.stack);
  res.status(500).json({ success: false, message: 'Internal server error' });
});

// ─── Start Server ─────────────────────────────────────────────────────────────
const start = async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ Database connected');
    await sequelize.sync({ alter: true });
    console.log('✅ Models synced');
    app.listen(PORT, () => {
      console.log(`🚀 RideFlow server running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('❌ Unable to start server:', error);
    process.exit(1);
  }
};

start();
