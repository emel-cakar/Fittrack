const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboardController');
const { requireLogin } = require('../middleware/auth');

// Home page — visible to everyone
// No need to pass { username } — app.js sets res.locals.username globally
router.get('/', (req, res) => {
    res.render('index');
});

// About page — visible to everyone
router.get('/about', (req, res) => {
    res.render('about');
});

// Dashboard — only for logged-in users
router.get('/dashboard', requireLogin, dashboardController.index);

module.exports = router;
