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
const profilesInRequested = "profilesInRequested.txt";
const profilesOutRequested = "profilesOutRequested.txt";
const profilesOutNotRequested = "profilesOutNotRequested.txt";
const linkedinCustomConnectionText = "linkedinCustomConnectionText.txt";

// Set up output files/streams
const profilesOutRequestedStream =
  syncFs.createWriteStream(profilesOutRequested);
const profilesOutNotRequestedStream = syncFs.createWriteStream(
  profilesOutNotRequested
);

// Main function
(async () => {
  // Clean cookies
  const cleanedCookies = await linkedinCleanCookies(inputFileCookies);

  // Read LinkedIn profile URLs from profiles.txt
  const profiles = (await fs.readFile(profilesInRequested, "utf8"))
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
          profilesOutRequestedStream.write(
            `${JSON.stringify(profileDetails)}\n`
          );
        } else {
          profilesOutNotRequestedStream.write(`${profile}\n`);
        }
      } else {
        profilesOutNotRequestedStream.write(`${profile}\n`);
      }
    } catch (error) {
      console.log(
        `Catch-all around grabbing profile details and connecting: ${error.message}`
      );
      profilesOutNotRequestedStream.write(`${profile}\n`);
    }
  }

  await browser.close();
  profilesOutRequestedStream.end();
  profilesOutNotRequestedStream.end();
})();
