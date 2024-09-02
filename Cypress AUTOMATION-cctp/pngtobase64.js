const fs = require('fs');
const path = require('path');

const screenshotsDir = './cypress/screenshots';
const outputFilePath = './cypress/screenshots/screenshots_base64.json';
const detailCommandLogsPath = './cypress/screenshots/screenshot-details.json';

// Function to convert image to base64
const convertScreenshotsToBase64 = (dir) => {
    const items = fs.readdirSync(dir);
    const base64Screenshots = {};

    items.forEach(item => {
        const itemPath = path.join(dir, item);
        if (fs.lstatSync(itemPath).isDirectory()) {
            // Recursively process subdirectories
            Object.assign(base64Screenshots, convertScreenshotsToBase64(itemPath));
        } else if (fs.lstatSync(itemPath).isFile() && path.extname(item) === '.png') {
            const fileData = fs.readFileSync(itemPath, { encoding: 'base64' });
            base64Screenshots[item] = fileData; // Use the filename as the key
            console.log(`Converted ${item} to base64`);
        }
    });

    return base64Screenshots;
};

const base64Screenshots = convertScreenshotsToBase64(screenshotsDir);
fs.writeFileSync(outputFilePath, JSON.stringify(base64Screenshots, null, 2));

console.log("Screenshots converted to base64 and saved to", outputFilePath);

// Read existing data from screenshot-details.json
let detailCommandLogs = {};
if (fs.existsSync(detailCommandLogsPath)) {
    try {
        const rawData = fs.readFileSync(detailCommandLogsPath, 'utf-8');
        detailCommandLogs = JSON.parse(rawData);
    } catch (error) {
        console.error("Error reading or parsing screenshot-details.json:", error);
    }
} else {
    console.error("screenshot-details.json file does not exist.");
}

// Function to add base64 data to the logs
const addBase64ToLogs = (logs, base64Screenshots) => {
    for (const testFile in logs) {
        for (const screenshotPath in logs[testFile]) {
            const logEntry = logs[testFile][screenshotPath];
            const screenshotName = path.basename(logEntry.path);
            if (base64Screenshots[screenshotName]) {
                logEntry.base64 = base64Screenshots[screenshotName];
                console.log(`Added base64 data for ${screenshotName} to logs`);
            }
        }
    }
};

// Add the base64 data to the corresponding entries in detailCommandLogs
addBase64ToLogs(detailCommandLogs, base64Screenshots);

// Write the updated data back to screenshot-details.json
try {
    fs.writeFileSync(detailCommandLogsPath, JSON.stringify(detailCommandLogs, null, 2));
    console.log("Base64 data added to", detailCommandLogsPath);
} catch (error) {
    console.error("Error writing to screenshot-details.json:", error);
}
