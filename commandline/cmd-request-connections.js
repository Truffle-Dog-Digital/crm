const syncFs = require("fs");
const fs = require("fs").promises;
const linkedinCleanCookies = require("./linkedinCleanCookies");
const { createPage } = require("./puppeteerSetup");
const linkedinGrabProfileDetails = require("./linkedinGrabProfileDetails");
const linkedinConnect = require("./linkedinConnect");

// Configuration
const testMode = true;
const headless = false;
const inputFileCookies = "linkedinCookies.json";
const profilesIn = "profilesIn.txt";
const profilesOutSuccess = "profilesOutSuccess.txt";
const profilesOutFail = "profilesOutFail.txt";
const linkedinCustomConnectionText = "linkedinCustomConnectionText.txt";

// Set up output files/streams
const profilesOutSuccessStream = syncFs.createWriteStream(profilesOutSuccess);
const profilesOutFailStream = syncFs.createWriteStream(profilesOutFail);

// Main function
(async () => {
  // Clean cookies
  const cleanedCookies = await linkedinCleanCookies(inputFileCookies);

  // Read LinkedIn profile URLs from profiles.txt
  const profiles = (await fs.readFile(profilesIn, "utf8"))
    .split("\n")
    .filter((line) => line.trim() !== "");

  // Read custom connection text from customConnection.txt
  const customText = await fs.readFile(linkedinCustomConnectionText, "utf8");

  const { browser, page } = await createPage(cleanedCookies, headless);

  for (const profile of profiles) {
    try {
      await page.goto(profile, { waitUntil: "domcontentloaded" });

      const profileDetails = await linkedinGrabProfileDetails(
        page,
        profile,
        customText
      );

      if (profileDetails) {
        const connected = await linkedinConnect(
          testMode,
          profile,
          page,
          customText
        );

        if (connected) {
          profilesOutSuccessStream.write(`${JSON.stringify(profileDetails)}\n`);
        } else {
          profilesOutFailStream.write(`${profile}\n`);
        }
      } else {
        profilesOutFailStream.write(`${profile}\n`);
      }
    } catch (error) {
      console.log(
        `Catch-all around grabbing profile details and connecting: ${error.message}`
      );
      profilesOutFailStream.write(`${profile}\n`);
    }
  }

  await browser.close();
  profilesOutSuccessStream.end();
  profilesOutFailStream.end();
})();
