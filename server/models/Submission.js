const mongoose = require("mongoose");

const submissionSchema = new mongoose.Schema({
	problemId : {
        type : String
    },

    code : {
        type : String
    },

    verdict : {
        type : String
    },

    submittedBy : {
        type : String
    },

    submittedAt : {
        type : Date
    }
})

module.exports = mongoose.model("Submission", submissionSchema);
