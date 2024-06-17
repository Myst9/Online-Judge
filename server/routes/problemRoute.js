const express = require("express");
const router = express.Router();
const problemController = require("../controllers/problemController");
const auth = require("../auth");

router.post("/create", auth.verify, (req, res) => {

	const data = {
		problem: req.body,
		isAdmin: auth.decode(req.headers.authorization).isAdmin
	};
	//console.log(data);
	problemController.createProblem(data).then(resultFromController => res.send(
		resultFromController));
});

router.get("/problem-list", (req, res) => {
	problemController.getAllProblems().then(resultFromController => res.send(
		resultFromController));
});

router.get("/:problemId", (req, res) => {
	problemController.getProblem(req.params).then(resultFromController => res.send(
		resultFromController));
});

module.exports = router;