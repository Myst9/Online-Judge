const express = require('express');
const router = express.Router();
const submissionController = require('../controllers/submissionController');

// Route to get submission by user id and problem id
router.get('/:userId/:problemId', submissionController.getSubmission);

module.exports = router;