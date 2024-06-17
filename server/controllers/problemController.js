const Problem = require("../models/Problem");

module.exports.createProblem = (data) => {

	if(data.isAdmin){
		let newProblem = new Problem({
			name: data.problem.name,
			problemStatement: data.problem.problemStatement,
			testCases: data.problem.testCases,
			createdBy: data.problem.createdBy
		});

		return newProblem.save().then((problem, error) => {

			if(error){
				return false;
			} else {
				return true;
			}
		})
	}

	let message = Promise.resolve("User must be an Admin to access this.")
	return message.then((value) => {
		return value
	});
};

module.exports.getAllProblems = () => {
	return Problem.find({}).then(result => {
		return result;
	});
};

module.exports.getProblem = (reqParams) => {
	return Problem.findById(reqParams.problemId).then(result => {
		console.log(result);
		return result;
	});
};


