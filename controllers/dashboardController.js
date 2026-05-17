const db = require('../config/db');

// Dashboard — shows summary stats and recent workouts for the logged-in user
exports.index = async (req, res) => {
    const userId = req.session.userId;

    try {
        // Total number of workouts logged
        const [[countRow]] = await db.query(
            'SELECT COUNT(*) AS total FROM workouts WHERE user_id = ?',
            [userId]
        );

        // Total minutes trained (SUM returns null if no rows, so default to 0)
        const [[minsRow]] = await db.query(
            'SELECT COALESCE(SUM(duration_mins), 0) AS totalMins FROM workouts WHERE user_id = ?',
            [userId]
        );

        // Most recent 5 workouts
        const [recent] = await db.query(
            'SELECT * FROM workouts WHERE user_id = ? ORDER BY workout_date DESC LIMIT 5',
            [userId]
        );

        res.render('dashboard', {
            totalWorkouts : countRow.total,
            totalMins     : minsRow.totalMins,
            recent
        });
    } catch (err) {
        console.error(err);
        res.status(500).send('Error loading dashboard.');
    }
};
