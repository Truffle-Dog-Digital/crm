const syncFs = require("fs");
const fs = require("fs").promises;
const linkedinCleanCookies = require("./linkedinCleanCookies");
const { createPage } = require("./puppeteerSetup");
const linkedinGrabProfileDetails = require("./linkedinGrabProfileDetails");
const linkedinConnect = require("./linkedinConnect");

// Configuration
const testMode = false;
const headless = false;
const inputFileCookies = "linkedinCookies.json";
const inputFileProfiles = "profilesIn.txt";
const outputPeopleConnected = "profilesOutConected.txt";
const outputProfilesNotConnected = "profilesOutNotConnected.txt";
const inputFileCustomText = "linkedinCustomConnection.txt";
const outputFileLog = "connect.log";
const logTo = ["console", "file"];

// Set up output files/streams
const logStream = syncFs.createWriteStream(outputFileLog);
const peopleConnectedStream = syncFs.createWriteStream(outputPeopleConnected);
const profilesNotConnectedStream = syncFs.createWriteStream(
  outputProfilesNotConnected
);

// Function to log messages
const log = (message) => {
  const timestamp = `${new Date().toISOString()} - ${message}\n`;
  if (logTo.includes("console")) {
    console.log(message);
  }
  if (logTo.includes("file")) {
    logStream.write(timestamp);
  }
};

// Main function
(async () => {
  // Clean cookies
  const cleanedCookies = await linkedinCleanCookies(inputFileCookies);

  // Read LinkedIn profile URLs from profiles.txt
  const profiles = (await fs.readFile(inputFileProfiles, "utf8")).split("\n");

  // Read custom connection text from customConnection.txt
  const customText = await fs.readFile(inputFileCustomText, "utf8");

  const { browser, page } = await createPage(cleanedCookies, headless);

  for (const profile of profiles) {
    try {
      await page.goto(profile, { waitUntil: "domcontentloaded" });

      const profileDetails = await linkedinGrabProfileDetails(
        page,
        profile,
        customText,
        log
      );

      if (profileDetails) {
        const connected = await linkedinConnect(
          testMode,
          profile,
          page,
          customText,
          log
        );

        if (connected) {
          peopleConnectedStream.write(`${JSON.stringify(profileDetails)}\n`);
        } else {
          profilesNotConnectedStream.write(`${profile}\n`);
        }
      }
    } catch (error) {
      log(
        `Catch-all around grabbing profile details and connecting: ${error.message}`
      );
      profilesNotConnectedStream.write(`${profile}\n`);
    }
  }

  await browser.close();
  logStream.end();
  peopleConnectedStream.end();
  profilesNotConnectedStream.end();
})();
