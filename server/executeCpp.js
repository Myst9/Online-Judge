const fs = require('fs');
const { exec } = require("child_process");
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const outputPath = path.join(__dirname, 'outputsOfCode'); 

if (!fs.existsSync(outputPath)) {
    fs.mkdirSync(outputPath, { recursive: true });
}

const executeCpp = async (filePath, inputFilePath) => {
    const jobId = path.basename(filePath).split(".")[0];
    const outputFileName = `${jobId}.exe`;
    const outPath = path.join(outputPath, outputFileName);

    return new Promise((resolve, reject) => {
        const command = `g++ ${filePath} -o ${outPath} && cd ${outputPath} && timeout 5s ./${outputFileName} < ${inputFilePath}`;
        
        exec(command, (error, stdout, stderr) => {
            if (error) {
                if (error.code === 124) { // Timeout error code
                    return reject({ error: "Time limit exceeded", stderr });
                } else {
                    return reject({ error, stderr });
                }
            }
            if (stderr) {
                return reject({ error: "Execution error", stderr });
            }
            resolve(stdout);
        });
    });
};

module.exports = {
    executeCpp,
};
