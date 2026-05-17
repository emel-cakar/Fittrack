require('dotenv').config();

const express        = require('express');
const session        = require('express-session');
const methodOverride = require('method-override');
const path           = require('path');

const indexRoutes   = require('./routes/index');
const authRoutes    = require('./routes/auth');
const workoutRoutes = require('./routes/workouts');

const app = express();

// Set EJS as the view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Serve static files (CSS, images) from the public folder
app.use(express.static(path.join(__dirname, 'public')));

// Parse form data from POST requests
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// method-override lets forms send PUT/DELETE requests
app.use(methodOverride('_method'));

// Session setup — keeps the user logged in across pages
app.use(session({
    secret: process.env.SESSION_SECRET || 'fallback_secret',
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 1000 * 60 * 60 * 24 } // 24 hours
}));

// Make the logged-in username available in all EJS views automatically
app.use((req, res, next) => {
    res.locals.username = req.session.username || null;
    next();
});

// Routes
app.use('/',         indexRoutes);
app.use('/',         authRoutes);
app.use('/workouts', workoutRoutes);

// 404 page
app.use((req, res) => {
    res.status(404).render('404');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`FitTrack running at http://localhost:${PORT}`);
});
