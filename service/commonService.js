const fs = require("fs");

exports.readFile = async (filePath) => {
    let data = fs.readFileSync(filePath, { encoding: 'utf-8', flag: 'r' });
    if (data) return JSON.parse(data);
    return null;
}

exports.writeFile = async (filePath, fileData) => {
    return fs.writeFileSync(filePath, JSON.stringify(fileData), { encoding: 'utf-8', flag: 'w' });
}