const fs = require('fs');
const path = require('path');

// read the contents of the directory and return it as an array
function readDirectoryContent(directoryPath) {
  if (fs.existsSync(directoryPath)) {
    return fs.readdirSync(directoryPath);
  }
  console.error(`Directory ${directoryPath} does not exist.`);
  return [];
}

// Create the index entries for the files
function createIndexEntries(files, directoryPath) {
  let indexEntries = '';
  files.forEach(file => {
    if (file.endsWith('.md')) {
      const fileNameWithoutExtension = file.slice(0, -3); // Remove the .md extension
      indexEntries += `- [${fileNameWithoutExtension}](${directoryPath}/${file})\n`;
    }
  });
  return indexEntries;
}

// Update the README    
function updateReadme(readmePath, interfaceIndexEntries) {
  if (fs.existsSync(readmePath)) {
    let readmeContent = fs.readFileSync(readmePath, 'utf-8');
    readmeContent = readmeContent.replace('## Table of contents', `## Table of contents\n\n${interfaceIndexEntries}`);
    fs.writeFileSync(readmePath, readmeContent, 'utf-8');
  } else {
    console.error(`README file ${readmePath} does not exist.`);
  }
}

// Define the locations
const readmePath = path.resolve(__dirname, '../Technical-docs/README.md');
const interfacesPath = path.resolve(__dirname, '../Technical-docs/interfaces');

// Get the interface files
const interfaceFiles = readDirectoryContent(interfacesPath);

// Create the index entries for the interfaces
let interfaceIndexEntries = '### Interfaces\n\n';
interfaceIndexEntries += createIndexEntries(interfaceFiles, './interfaces');

// Update the README
updateReadme(readmePath, interfaceIndexEntries);
