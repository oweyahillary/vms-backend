require('dotenv').config();
const express = require('express');
const cors    = require('cors');
const helmet  = require('helmet');
const visitorRoutes = require('./routes/visitor.routes');
const adminRoutes   = require('./routes/admin.routes');
const logger  = require('./utils/logger');
const db      = require('./db');

const app = express();

app.use(cors({ origin: '*' }));
app.use(helmet());
app.use(express.json({ limit: '15mb' }));

// Request logger
app.use((req, res, next) => {
  logger.info({ method: req.method, url: req.url });
  next();
});

// Routes
app.use('/api/visitors', visitorRoutes);
app.use('/api/admin',    adminRoutes);

// Health check
app.get('/health', async (req, res) => {
  try {
    await db.healthCheck();
    res.json({ status: 'ok', server: 'running', database: 'connected', time: new Date().toISOString() });
  } catch (err) {
    res.status(503).json({ status: 'degraded', server: 'running', database: 'unreachable', error: err.message });
  }
});

app.get('/', (req, res) => res.json({ status: 'VMS Backend Running' }));

// Global error handler
app.use((err, req, res, next) => {
  logger.error({ event: 'unhandled_error', error: err.message });
  res.status(500).json({ error: 'Internal server error' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => logger.info(`Server running on port ${PORT}`));
