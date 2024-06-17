const express = require("express");
const router = express.Router();
const compilerController = require("../controllers/compilerController");
const auth = require("../auth");

router.post(`/run` , compilerController.run ) ;

router.post(`/submit`, auth.verify, compilerController.submit);

module.exports = router;