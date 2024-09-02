import { getScreenshotDetails } from './utils';
let testSteps = [];

function addTestStep(step, screenshotName = null) {
  testSteps.push({ step, screenshotName });
}

describe('Sample suite', () => {
  beforeEach(() => {
    testSteps = [];  // Reset the test steps before each test
  });

  // afterEach(function() {
  //   const { suiteName, testName, fileName } = getScreenshotDetails(this.currentTest);
  //   //const screenshotName = `${suiteName}-${testName}`;
  //   cy.task('saveScreenshotInfo', { screenshotName, suiteName, testName, testSteps, fileName });
  // });

  it('TestCase1 - verify title-negative test', function() {
    cy.visit("https://opensource-demo.orangehrmlive.com/");
    cy.log("test started");

    cy.title().should('eq', 'OrangeHRM123');
    cy.screenshot();
    // cy.once('after:screenshot', (details) => {
    //   addTestStep('assertion title', details.path);
    // });

    cy.log("test ended");
  });

  it('TestCase2 - Saucedemo Site', function() {
    cy.visit("https://www.saucedemo.com/v1/");
    cy.screenshot();
    // cy.on('after:screenshot', (details) => {
    //   addTestStep('first ss visit website', details.path);
    // });

    cy.screenshot();
    // cy.on('after:screenshot', (details) => {
    //   addTestStep('second ss visit website', details.path);
    // });
  });
});

after(() => {
  cy.task('filterScreenshots');
});
