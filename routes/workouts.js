const express = require('express');
const router = express.Router();
const workoutController = require('../controllers/workoutController');
const { requireLogin } = require('../middleware/auth');

// All workout routes require the user to be logged in
router.use(requireLogin);

router.get('/',          workoutController.index);    // list + search
router.get('/add',       workoutController.showAdd);  // show add form
router.post('/add',      workoutController.add);      // submit add form
router.get('/:id/edit',  workoutController.showEdit); // show edit form
router.post('/:id/edit', workoutController.update);   // submit edit form
router.post('/:id/delete', workoutController.delete); // delete a workout

module.exports = router;
