const mongoose = require("mongoose");

const problemSchema = new mongoose.Schema({
	name : {
        type : String
    },

    problemStatement : {
        type : String
    },

    testCases : [{
        input: { type: String },
        output: { type: String },
    }],

    createdBy : {
        type : String
    }
})

module.exports = mongoose.model("Problem", problemSchema);
