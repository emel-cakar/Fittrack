const bcrypt = require('bcrypt');
const db = require('../config/db');

// Show the registration form
exports.showRegister = (req, res) => {
    res.render('register', { error: null });
};

// Handle registration form submission
exports.register = async (req, res) => {
    const { username, email, password } = req.body;

    // --- Validation: check for empty fields before hitting the database ---
    if (!username || !username.trim()) {
        return res.render('register', { error: 'Username is required.' });
    }
    if (!email || !email.trim()) {
        return res.render('register', { error: 'Email is required.' });
    }
    if (!password || password.length < 6) {
        return res.render('register', { error: 'Password must be at least 6 characters.' });
    }

    try {
        // Check if username or email already exists
        const [existing] = await db.query(
            'SELECT id FROM users WHERE username = ? OR email = ?',
            [username, email]
        );

        if (existing.length > 0) {
            return res.render('register', { error: 'Username or email already taken.' });
        }

        // Hash the password before storing it (never store plain text passwords)
        const hash = await bcrypt.hash(password, 10);

        await db.query(
            'INSERT INTO users (username, email, password_hash) VALUES (?, ?, ?)',
            [username, email, hash]
        );

        res.redirect('/login');
    } catch (err) {
        console.error(err);
        res.render('register', { error: 'Something went wrong. Please try again.' });
    }
};

// Show the login form
exports.showLogin = (req, res) => {
    res.render('login', { error: null });
};

// Handle login form submission
exports.login = async (req, res) => {
    const { username, password } = req.body;

    try {
        const [rows] = await db.query(
            'SELECT * FROM users WHERE username = ?',
            [username]
        );

        if (rows.length === 0) {
            return res.render('login', { error: 'Invalid username or password.' });
        }

        const user = rows[0];

        // Compare the submitted password against the stored hash
        const match = await bcrypt.compare(password, user.password_hash);

        if (!match) {
            return res.render('login', { error: 'Invalid username or password.' });
        }

        // Save user info to session so we know who is logged in
        req.session.userId   = user.id;
        req.session.username = user.username;

        // Send the user to their dashboard after a successful login
        res.redirect('/dashboard');
    } catch (err) {
        console.error(err);
        res.render('login', { error: 'Something went wrong. Please try again.' });
    }
};

// Log the user out by destroying their session
exports.logout = (req, res) => {
    req.session.destroy(() => {
        res.redirect('/');
    });
};
