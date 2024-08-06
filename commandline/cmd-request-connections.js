const syncFs = require("fs");
const fs = require("fs").promises;
const linkedinCleanCookies = require("./linkedinCleanCookies");
const { createPage } = require("./puppeteerSetup");
const linkedinGrabProfileDetails = require("./linkedinGrabProfileDetails");
const linkedinConnect = require("./linkedinConnect");
const { getProfileId, reorderProfileDetails } = require("./helpers-profiles");

// Configuration
const testMode = true;
const headless = false;
const inputFileCookies = "linkedinCookies.json";
const profilesIn = "profilesIn.txt";
const humansOutSuccess = "humansOutSuccess.jsonl";
const profilesOutFail = "profilesOutFail.txt";
const linkedinCustomConnectionText = "linkedinCustomConnectionText.txt";

// Set up output files/streams
const humansOutSuccessStream = syncFs.createWriteStream(humansOutSuccess);
const profilesOutFailStream = syncFs.createWriteStream(profilesOutFail);

// Main function
(async () => {
  // Clean cookies
  const cleanedCookies = await linkedinCleanCookies(inputFileCookies);

  // Read LinkedIn profile URLs from profilesIn.txt and remove blank lines
  const profiles = (await fs.readFile(profilesIn, "utf8"))
    .split("\n")
    .filter((line) => line.trim() !== "")
    .map((line) => line.trim());

  // Read custom connection text from linkedinCustomConnectionText.txt
  const customText = await fs.readFile(linkedinCustomConnectionText, "utf8");

  const { browser, page } = await createPage(cleanedCookies, headless);

  let totalLines = 0;
  let successfulLines = 0;

  for (const profile of profiles) {
    const profileId = getProfileId(profile);
    if (!profileId) {
      profilesOutFailStream.write(`${profile}\n`);
      continue;
    }

    const profileUrl = `https://linkedin.com/in/${profileId}/`;
    totalLines++;

    try {
      await page.goto(profileUrl, { waitUntil: "domcontentloaded" });

      // Grab profile details without including the `profile` key
      const profileDetails = await linkedinGrabProfileDetails(
        page,
        profileId,
        customText
      );

      if (profileDetails) {
        const connected = await linkedinConnect(
          testMode,
          profileUrl,
          page,
          customText
        );

        if (connected) {
          // Use the new helper function to reorder profile details
          const reorderedProfileDetails = reorderProfileDetails(
            profileDetails,
            profileId
          );

          humansOutSuccessStream.write(
            `${JSON.stringify(reorderedProfileDetails)}\n`
          );
          successfulLines++;
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
  humansOutSuccessStream.end();
  profilesOutFailStream.end();

  console.log("Summary:");
  console.log(`Total non-blank lines input: ${totalLines}`);
  console.log(`Total successful profiles processed: ${successfulLines}`);
})();
