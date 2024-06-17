const Problem = require('../models/Problem') ;
const Submission = require('../models/Submission') ;
const {generateFile} = require('../generateFile.js');
const {generateInputFile} = require("../generateInputFile.js");
const {executeCpp} = require('../executeCpp.js');
const { exec } = require('child_process');

module.exports.run = async (req , res) => {
    const { language='cpp', code, input } = req.body ;

    if(code === undefined){
        return res.status(500).json( {
            success : false ,
            error : "Empty Code",
        })
    }

    try{
        const filePath = await generateFile(language, code) ;
        const inputFilePath = await generateInputFile(input) ;
        const output = await executeCpp(filePath, inputFilePath) ;
        return res.json({
            success: true,
            output: output,
        });
    }
    catch(error){
        console.log(error);
        if (error.error === "Time limit exceeded") {
            return res.status(500).json({
                success: false,
                error: "Time limit exceeded",
            });
        } else {
            return res.status(500).json({
                success: false,
                error: error.stderr,
            });
        }
    }
};

module.exports.submit = async (req, res) => {
    try {
        const problemId = req.body.problemId;
        const userId = req.body.user.id;
        const { language = 'cpp', code } = req.body;
        
        if (!code) {
            console.log("Empty code");
            return res.json({
                success: false,
                error: "Empty Code",
            });
        }

        const problem = await Problem.findOne({ _id: problemId });

        if (!problem) {
            console.log("Problem not found:", problemId);
            return res.json({
                success: false,
                error: "Problem does not exist",
            });
        }

        let verdict = "Accepted";

        const submission = new Submission({
            problemId: problemId,
            code: code,
            verdict: verdict,
            submittedBy: userId,
            submittedAt: Date.now()
        });

        const testCases = problem.testCases || [];

        const filePath = await generateFile(language, code);

        for (const testCase of testCases) {

            const fileInputPath = await generateInputFile(testCase.input);

            let generatedOutput = "";
            try {
                generatedOutput = await executeCpp(filePath, fileInputPath);
            } 
            catch (error) {
                if(error == "Time limit exceeded"){
                    verdict = error;
                    submission.verdict = verdict;
                    await submission.save();
                    return res.status(500).json({
                        success: false,
                        error: verdict,
                    });
                }
                console.log("Error during execution:", error);
                verdict = `Error: ${error.stderr || error.error || error.message}`;
                submission.verdict = verdict;
                await submission.save();

                return res.json({
                    success: false,
                    error: verdict,
                });
            }

            const correctOutput = testCase.output;

            if (generatedOutput.trim() !== correctOutput.trim()) {
                verdict = "Wrong answer";
                submission.verdict = verdict;
                await submission.save();
                break;
            }
        }

        res.json({
            success: true,
            verdict: submission.verdict,
        });
        await submission.save();
    } catch (error) {
        res.json({
            success: false,
            error: error.message,
        });
    }
};