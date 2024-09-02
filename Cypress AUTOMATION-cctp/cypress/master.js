const fs = require('fs');
const path = require('path');

const screenshotDetailsPath = './cypress/screenshots/screenshot-details.json';
const masterFilePath = './cypress/results/master.json';

// Function to read JSON file
const readJsonFile = (filePath) => {
  if (fs.existsSync(filePath)) {
    return JSON.parse(fs.readFileSync(filePath, 'utf8'));
  }
  return {};
};

// Function to write JSON file
const writeJsonFile = (filePath, data) => {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
};

// Read screenshot details
const screenshotDetails = readJsonFile(screenshotDetailsPath);

// Read or initialize master.json
let masterData = readJsonFile(masterFilePath);

// Initialize the data array if it doesn't exist
if (!masterData.data) {
  masterData.data = [];
}

// Update master.json based on screenshot details
Object.keys(screenshotDetails).forEach(testFileName => {
  const screenshots = screenshotDetails[testFileName];
  let testFileData = {};

  // Update or add screenshot details
  Object.keys(screenshots).forEach(screenshotPath => {
    testFileData[screenshotPath] = screenshots[screenshotPath];
  });

  // Check if the test file already exists in the data array
  const existingTestFileIndex = masterData.data.findIndex(item => item[testFileName]);

  if (existingTestFileIndex !== -1) {
    // Merge the new screenshots with the existing ones
    masterData.data[existingTestFileIndex][testFileName] = {
      ...masterData.data[existingTestFileIndex][testFileName],
      ...testFileData
    };
  } else {
    // Add the new test file data to the data array
    masterData.data.push({ [testFileName]: testFileData });
  }
});

// Write updated data back to master.json
writeJsonFile(masterFilePath, masterData);

console.log('master.json has been updated successfully.');
