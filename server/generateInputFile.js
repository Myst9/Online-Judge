const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const dirInput = path.join(__dirname, 'input'); 

if (!fs.existsSync(dirInput)){
    fs.mkdirSync(dirInput, { recursive: true });
}

const generateInputFile = async (input) => {

    const jobId = uuidv4() ;
    const fileName = `${jobId}.txt`;
    const filePath = path.join(dirInput, fileName);
    fs.writeFileSync(filePath, input);
    return filePath;

}; 

module.exports = {
    generateInputFile,
};