const path = require('path');
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const env = require('./config/env');
const { errorHandler, notFoundHandler } = require('./middleware/errorHandler');
const { UPLOAD_DIR } = require('./middleware/upload');

const authRoutes = require('./routes/auth.routes');
const userRoutes = require('./routes/user.routes');
const doctorRoutes = require('./routes/doctor.routes');
const adminRoutes = require('./routes/admin.routes');
const uploadRoutes = require('./routes/upload.routes');
const publicRoutes = require('./routes/public.routes');

const app = express();

// Railway (and most hosts) terminate HTTPS at a proxy; trust it so
// req.protocol is "https" and uploaded-file URLs are built with https.
app.set('trust proxy', 1);

app.use(helmet({ crossOriginResourcePolicy: { policy: 'cross-origin' } }));
app.use(cors({ origin: env.CORS_ORIGIN }));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

if (env.NODE_ENV !== 'test') {
  app.use(morgan(env.NODE_ENV === 'development' ? 'dev' : 'combined'));
}

app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'skincare-consultation-backend', timestamp: new Date().toISOString() });
});

app.use('/uploads', express.static(UPLOAD_DIR));

// Public-facing homepage - linked from Razorpay/Play Store/App Store listings
// as the business's website.
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/index.html'));
});

// Google Play requires an account-deletion page reachable without logging
// into the app - see routes/public.routes.js for the form's endpoint.
app.get('/account-deletion', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/account-deletion.html'));
});

// Linked from the Play Console / App Store Connect listings and from
// within the app (Settings/Profile).
app.get('/privacy-policy', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/privacy-policy.html'));
});
app.get('/terms-and-conditions', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/terms-and-conditions.html'));
});
app.get('/refund-policy', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/refund-policy.html'));
});
app.get('/about-us', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/about-us.html'));
});

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/doctors', doctorRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/public', publicRoutes);

app.use(notFoundHandler);
app.use(errorHandler);

module.exports = app;
