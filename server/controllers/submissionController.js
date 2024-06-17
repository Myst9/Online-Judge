const Submission = require('../models/Submission');

// Controller function to get submission by user id and problem id
exports.getSubmission = async (req, res) => {
    const { userId, problemId } = req.params;

    try {
        // Find submission by user id and problem id
        const submission = await Submission.find({ problemId, submittedBy: userId });
        
        if (!submission) {
            return res.status(404).json({ message: 'Submission not found' });
        }

        res.status(200).json(submission);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
