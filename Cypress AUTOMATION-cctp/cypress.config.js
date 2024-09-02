const { defineConfig } = require("cypress");
const fs = require('fs');
const path = require('path');
const filePath = './cypress/screenshots/screenshot-details.json';

module.exports = defineConfig({
  reporter: 'cypress-mochawesome-reporter',
  reporterOptions: {
    charts: true,
    reportPageTitle: 'custom-title',
    embeddedScreenshots: true,
    inlineAssets: true,
    saveAllAttempts: false,
  },
  e2e: {
    screenshotsFolder: "./cypress/screenshots",
    screenshotOnRunFailure:true,
    trashAssetsBeforeRuns:true,
    setupNodeEvents(on, config) {
      require('cypress-mochawesome-reporter/plugin')(on);

      // implement node event listeners here
      require('cypress-terminal-report/src/installLogsPrinter')(on);
      on('task', {
        filterScreenshots() {
          const screenshotsDir = path.join("./cypress/screenshots");
          let screenshots = [];
          function readDirectory(directory) {
            try {
                const files = fs.readdirSync(directory);
                files.forEach(file => {
                    const filePath = path.join(directory, file);
                    const fileStat = fs.statSync(filePath);
                    if (fileStat.isDirectory()) {
                        readDirectory(filePath); // Recursively read subdirectories
                    } else if (file.endsWith('.png')) {
                        screenshots.push({
                            name: file,
                            time: fileStat.mtime
                        });
                    }
                });
            } catch (error) {
                console.error('Error reading directory:', error);
            }
        }
    
        readDirectory(screenshotsDir);
    
        screenshots.sort((a, b) => b.time - a.time);
    
        console.log('Filtered Screenshots by Timestamp:');
        screenshots.forEach(screenshot => {
          const date = new Date(screenshot.time);
          const milliseconds = date.getTime(); // Convert date to milliseconds
          console.log(`timeString - ${milliseconds}: ${screenshot.name}`);

      });
          return screenshots;
      },
        log(message) {
          const logFilePath = path.join("./cypress/logs/cypress.log");
          fs.appendFileSync(logFilePath, `${new Date().toISOString()} - ${message}\n`);
          return null;
        }
      });
     
            on('after:screenshot', (details) => {
              // You can access and modify the screenshot details here
              console.log('Screenshot details:', details);
            
              const screenshotName = path.basename(details.path);
              console.log('Screenshot name:', screenshotName);
              console.log('Suite:', details.suite);
  console.log('Test case:', details.testcase);

              const fail = details.testFailure
              const steps = details.testSteps
              
            
              const screenshotInfo = {
                TestfileName: details.specName,
                suite: details.suite,
                testcase : details.testcase,
                testfailure: fail,
                teststeps: steps,
                Screenshotname: screenshotName,
                path: `./cypress/screenshots/${screenshotName}`,
                takenAt: new Date().toISOString(),
                
              };
            
      
              // Read the existing JSON file
              fs.readFile(filePath, 'utf8', (err, data) => {
                let json = {};
                if (!err && data) {
                  json = JSON.parse(data);
                }
                if (!json[details.specName]) {
                  json[details.specName] = {};
                }
            
                // Use the screenshot name as the unique key
                json[details.specName][screenshotInfo.path] = screenshotInfo;
              
                // Write the updated JSON back to the file
                fs.writeFile(filePath, JSON.stringify(json, null, 2), (err) => {
                  if (err) {
                    console.error('Error writing to JSON file', err);
                  } else {
                    console.log('Screenshot details saved to JSON file');
                  }
                
                });
              
              });      
              // Example: Change the path of the screenshot
              
            });
      on('task', {
        // log(message) {
        //   const logFilePath = path.join("./cypress/logs/cypress.log");
        //   fs.appendFileSync(logFilePath, `${new Date().toISOString()} - ${message}\n`);
        //   return null;
        // },
        
        logScreenshot(info) {
          const screenshotlogFilePath = path.join("./cypress/logs/screenshots.log");
          fs.appendFileSync(screenshotlogFilePath, `${new Date().toISOString()} - ${info}\n`);
          return null;
        },
        
        saveScreenshotInfo({  screenshotName, suiteName, testName, testSteps, fileName}) {
          const screenshotInfo = {
            suite: suiteName,
            testcase: testName,
            Teststeps: testSteps,
            TestCasesreenshot: screenshotName,
            file: fileName,
            path: `./cypress/screenshots/${fileName}`,
            timestamp: new Date().toISOString()
          }
          const jsonFilePath = path.join("./cypress/screenshots/screenshotInfo.json");
          fs.readFile(jsonFilePath, 'utf8', (err, data) => {
            let json = {};
            if (!err && data) {
              json = JSON.parse(data);
            }
        
            json[screenshotName] = screenshotInfo;
                
          fs.writeFileSync(jsonFilePath, JSON.stringify(json, null, 2), 'utf8');
          });
          return null;
        },
        
      });
    },
  },
});
