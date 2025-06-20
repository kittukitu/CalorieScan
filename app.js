const express = require('express');
const session = require('express-session');
const flash = require('connect-flash');
const path = require('path');
const passport = require('passport');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 5000;

dotenv.config();

// Ensure 'uploads' folder exists
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir);
}

// Middleware to make `user` available in all views
app.use((req, res, next) => {
    res.locals.user = req.user || null;
    next();
});

// Passport and database setup
require('./config/passport-setup');
require('./config/db');

// Body parsing and JSON middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Set up session
app.use(session({
    secret: process.env.SESSION_SECRET || 'default_secret',
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 24 * 60 * 60 * 1000 } // 24 hours
}));

// Initialize Passport
app.use(passport.initialize());
app.use(passport.session());

// Flash messages
app.use(flash());

// Global flash messages setup
app.use((req, res, next) => {
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
});

// Set view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Static file serving
app.use(express.static(path.join(__dirname, 'public')));

// Import routes
const scanRoutes = require('./routes/scanRoutes');
const authRoutes = require('./routes/auth');
const calculatorRoute = require('./routes/calculator');
const trackerRoutes = require('./routes/trackerRoutes');
const adminRoutes = require('./routes/adminRoutes');
const settingsRoutes = require('./routes/settingsRoutes');
const aboutRoutes = require('./routes/aboutRoutes');

// Routes
app.use('/scan', scanRoutes);
app.use(authRoutes);
app.use('/calculator', calculatorRoute);
app.use(trackerRoutes);
app.use('/admin', adminRoutes);
app.use(settingsRoutes);
app.use(aboutRoutes);

// Default route
app.get('/', (req, res) => {
    res.redirect('/login');
});

// Protected dashboard route
function isAuthenticated(req, res, next) {
    if (req.isAuthenticated()) return next();
    res.redirect('/login');
}

app.get('/dashboard', isAuthenticated, (req, res) => {
    res.render('dashboard', { user: req.user });
});

// Settings page
app.get('/settings', isAuthenticated, (req, res) => {
    res.render('settings', { user: req.user });
});

// 404 Handling
app.use((req, res) => {
    res.status(404).render('404');
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});