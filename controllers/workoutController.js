const db = require('../config/db');

// Show all workouts for the logged-in user, with optional search
exports.index = async (req, res) => {
    const userId  = req.session.userId;
    const search  = req.query.search  || '';
    const success = req.query.success || null;

    try {
        let query  = 'SELECT * FROM workouts WHERE user_id = ?';
        let params = [userId];

        // If search is provided, filter by exercise name or category
        if (search) {
            query += ' AND (exercise_name LIKE ? OR category LIKE ?)';
            params.push(`%${search}%`, `%${search}%`);
        }

        query += ' ORDER BY workout_date DESC';

        const [workouts] = await db.query(query, params);

        res.render('workouts/index', { workouts, search, success });
    } catch (err) {
        console.error(err);
        res.status(500).send('Error loading workouts.');
    }
};

// Show the add workout form
exports.showAdd = (req, res) => {
    res.render('workouts/add', { error: null, old: {} });
};

// Handle add workout form submission
exports.add = async (req, res) => {
    const { exercise_name, category, duration_mins, notes, workout_date } = req.body;
    const userId = req.session.userId;

    // Keep submitted values so the form can refill them if there's an error
    const old = { exercise_name, category, duration_mins, notes, workout_date };

    // Validation
    if (!exercise_name || !exercise_name.trim()) {
        return res.render('workouts/add', { error: 'Exercise name is required.', old });
    }
    if (!category) {
        return res.render('workouts/add', { error: 'Please select a category.', old });
    }
    if (!workout_date) {
        return res.render('workouts/add', { error: 'Date is required.', old });
    }
    if (duration_mins && (isNaN(duration_mins) || Number(duration_mins) < 1)) {
        return res.render('workouts/add', { error: 'Duration must be a positive number.', old });
    }

    try {
        await db.query(
            `INSERT INTO workouts
             (user_id, exercise_name, category, duration_mins, notes, workout_date)
             VALUES (?, ?, ?, ?, ?, ?)`,
            [
                userId,
                exercise_name.trim(),
                category,
                duration_mins || null,
                notes         || null,
                workout_date
            ]
        );

        res.redirect('/workouts?success=Workout added successfully!');
    } catch (err) {
        console.error(err);
        res.render('workouts/add', { error: 'Could not save workout. Please try again.', old });
    }
};

// Show the edit form for a specific workout
exports.showEdit = async (req, res) => {
    const userId    = req.session.userId;
    const workoutId = req.params.id;

    try {
        // Check the workout belongs to the logged-in user before showing it
        const [rows] = await db.query(
            'SELECT * FROM workouts WHERE id = ? AND user_id = ?',
            [workoutId, userId]
        );

        if (rows.length === 0) {
            return res.status(404).send('Workout not found.');
        }

        res.render('workouts/edit', { workout: rows[0], error: null });
    } catch (err) {
        console.error(err);
        res.status(500).send('Error loading workout.');
    }
};

// Handle edit form submission
exports.update = async (req, res) => {
    const userId    = req.session.userId;
    const workoutId = req.params.id;
    const { exercise_name, category, duration_mins, notes, workout_date } = req.body;

    // Re-render the edit form with an error and the submitted values still showing
    const renderError = async (msg) => {
        const [rows] = await db.query(
            'SELECT * FROM workouts WHERE id = ? AND user_id = ?',
            [workoutId, userId]
        );
        const workout = { ...rows[0], exercise_name, category, duration_mins, notes, workout_date };
        return res.render('workouts/edit', { workout, error: msg });
    };

    // Validation
    if (!exercise_name || !exercise_name.trim()) {
        return renderError('Exercise name is required.');
    }
    if (!category) {
        return renderError('Please select a category.');
    }
    if (!workout_date) {
        return renderError('Date is required.');
    }
    if (duration_mins && (isNaN(duration_mins) || Number(duration_mins) < 1)) {
        return renderError('Duration must be a positive number.');
    }

    try {
        await db.query(
            `UPDATE workouts
             SET exercise_name = ?, category = ?, duration_mins = ?, notes = ?, workout_date = ?
             WHERE id = ? AND user_id = ?`,
            [
                exercise_name.trim(),
                category,
                duration_mins || null,
                notes         || null,
                workout_date,
                workoutId,
                userId
            ]
        );

        res.redirect('/workouts?success=Workout updated successfully!');
    } catch (err) {
        console.error(err);
        res.status(500).send('Error updating workout.');
    }
};

// Delete a workout
exports.delete = async (req, res) => {
    const userId    = req.session.userId;
    const workoutId = req.params.id;

    try {
        await db.query(
            'DELETE FROM workouts WHERE id = ? AND user_id = ?',
            [workoutId, userId]
        );

        res.redirect('/workouts?success=Workout deleted.');
    } catch (err) {
        console.error(err);
        res.status(500).send('Error deleting workout.');
    }
};
