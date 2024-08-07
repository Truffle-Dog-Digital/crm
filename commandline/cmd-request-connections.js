const syncFs = require("fs");
const fs = require("fs").promises;
const linkedinCleanCookies = require("./linkedinCleanCookies");
const { createPage } = require("./puppeteerSetup");
const linkedinGrabProfileDetails = require("./linkedinGrabProfileDetails");
const linkedinConnect = require("./linkedinConnect");
const { getProfileId, reorderProfileDetails } = require("./helpers-profiles");
const { getArrayFromTextFile, getMapFromJsonl } = require("./helpers-files");
const { getTodayISODate } = require("./helpers-general");

// Configuration
const testMode = true;
const headless = false;
const inputFileCookies = "linkedinCookies.json";
const profilesIn = "profilesIn.txt";
const humansMaster = "humansMaster.jsonl";
const humansOutSuccess = "humansOutSuccess.jsonl";
const profilesOutFail = "profilesOutFail.txt";
const linkedinCustomConnectionText = "linkedinCustomConnectionText.txt";
const maxSuccessfulProfiles = 20;

// Main function
(async () => {
  // Clean cookies
  const cleanedCookies = await linkedinCleanCookies(inputFileCookies);

  // Read LinkedIn profile URLs from profilesIn.txt
  const profilesInArray = await getArrayFromTextFile(profilesIn);

  // Read custom connection text from linkedinCustomConnectionText.txt
  const customText = await fs.readFile(linkedinCustomConnectionText, "utf8");

  // Read humansMaster.jsonl and extract profile IDs
  const humansData = await getMapFromJsonl(humansMaster);
  if (!humansData) {
    console.error("Failed to load humans from JSONL.");
    return;
  }
  const existingProfileIds = new Set(
    Array.from(humansData.values()).map((human) => human.profileId)
  );

  const { browser, page } = await createPage(cleanedCookies, headless);

  let totalLines = 0;
  let successfulLines = 0;
  let preexistingLine = 0;
  let failedProfileLines = 0;
  let lastSuccessfulProfileId = null;
  const profilesOutFailData = [];
  const humansOutSuccessData = [];

  for (const profileInString of profilesInArray) {
    if (successfulLines >= maxSuccessfulProfiles) {
      break;
    }

    totalLines++;

    const profileId = getProfileId(profileInString);
    if (!profileId || existingProfileIds.has(profileId)) {
      profilesOutFailData.push(profileInString);
      preexistingLine++;
      continue;
    }

    // Add profileId to existingProfileIds to avoid duplicates
    existingProfileIds.add(profileId);

    const profileUrl = `https://linkedin.com/in/${profileId}/`;

    try {
      await page.goto(profileUrl, { waitUntil: "domcontentloaded" });

      // Grab profile details without including the `profile` key
      const profileDetails = await linkedinGrabProfileDetails(page);

      if (profileDetails) {
        profileDetails.profileId = profileId;
        profileDetails.customText = customText;
        profileDetails.requestSent = getTodayISODate();

        const connected = await linkedinConnect(
          testMode,
          profileUrl,
          page,
          customText
        );

        if (connected) {
          // Use the new helper function to reorder profile details
          const reorderedProfileDetails = reorderProfileDetails(profileDetails);

          humansOutSuccessData.push(reorderedProfileDetails);
          successfulLines++;
          lastSuccessfulProfileId = profileId;
        } else {
          profilesOutFailData.push(profileInString);
        }
      } else {
        failedProfileLines++;
        console.log(`Failed profile grab:  ${profileUrl}`);
        profilesOutFailData.push(profileInString);
      }
    } catch (error) {
      console.log(
        `Catch-all around grabbing profile details and connecting: ${error.message}`
      );
      profilesOutFailData.push(profileInString);
    }
  }

  await browser.close();

  // Write output files
  await fs.writeFile(
    humansOutSuccess,
    humansOutSuccessData.map((item) => JSON.stringify(item)).join("\n"),
    "utf8"
  );
  await fs.writeFile(profilesOutFail, profilesOutFailData.join("\n"), "utf8");

  console.log("Summary:");
  console.log(`Processed:       ${totalLines}`);
  console.log(`Already in DB:   ${preexistingLine}`);
  console.log(`Failed grab:     ${failedProfileLines}`);
  console.log(`Successful:      ${successfulLines}`);
  console.log(`Last successful  ${lastSuccessfulProfileId}`);
})();
