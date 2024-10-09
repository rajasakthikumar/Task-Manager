const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');

// Directory to start scanning
const startDir = './'; // Change this to your starting directory if needed

// Function to get all .js files from a directory recursively
function getAllJsFiles(dir, fileList = []) {
  const files = fs.readdirSync(dir);

  files.forEach((file) => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);

    if (stat.isDirectory() && file !== 'node_modules') {
      getAllJsFiles(filePath, fileList);
    } else if (path.extname(file) === '.js') {
      fileList.push(filePath);
    }
  });

  return fileList;
}

// Function to run Node.js for each .js file
function runNodeForEachFile(jsFiles) {
  jsFiles.forEach((filePath) => {
    exec(`node "${filePath}"`, (error, stdout, stderr) => {
      if (error) {
        console.error(`Error executing ${filePath}:`, error.message);
        return;
      }
      if (stderr) {
        console.error(`Stderr from ${filePath}:`, stderr);
        return;
      }
      console.log(`Output from ${filePath}:\n${stdout}`);
    });
  });
}

// Main process
try {
  const jsFiles = getAllJsFiles(startDir);
  runNodeForEachFile(jsFiles);
} catch (err) {
  console.error('Error:', err);
}