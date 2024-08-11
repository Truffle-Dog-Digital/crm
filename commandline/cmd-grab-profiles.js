const syncFs = require("fs");
const fs = require("fs").promises;
const linkedinCleanCookies = require("./linkedinCleanCookies");
const { createPage } = require("./puppeteerSetup");
const linkedinGrabProfileDetails = require("./linkedinGrabProfileDetails");
const { getProfileId, reorderProfileDetails } = require("./helpers-profiles");
const { getArrayFromTextFile, getMapFromJsonl } = require("./helpers-files");
const { getTodayISODate } = require("./helpers-general");

// Configuration
const headless = false;
const inputFileCookies = "linkedinCookies.json";
const profilesIn = "profilesIn.txt";
const humansOutSuccess = "humansOutSuccess.jsonl";
const profilesOutFail = "profilesOutFail.txt";
const maxProfiles = 3;

// Main function
(async () => {
  // Clean cookies
  const cleanedCookies = await linkedinCleanCookies(inputFileCookies);

  // Read input profiles from file (line delimited text)
  const profilesInArray = await getArrayFromTextFile(profilesIn);

  // Create a set to dedupe inbound profile IDs
  const existingProfileIds = new Set();

  // Setup Puppeteer with cleaned Linkedin cookies
  const { browser, page } = await createPage(cleanedCookies, headless);

  // Set up a bunch of counters for reporting at the end
  let totalLines = 0;
  let successfulLines = 0;
  let failedProfileLines = 0;
  let lastSuccessfulProfileId = null;
  const profilesOutFailData = [];
  const humansOutSuccessData = [];

  // Loop through each profile in the input file
  for (const profileInString of profilesInArray) {
    if (successfulLines >= maxProfiles) {
      break;
    }

    totalLines++;

    // Get the profile ID from the input string
    const profileId = getProfileId(profileInString);

    // Skip if the profile ID is not valid or already exists in the master "database"
    if (!profileId || existingProfileIds.has(profileId)) {
      profilesOutFailData.push(profileInString);
      preexistingLine++;
      continue;
    }

    // Add the profile ID to the set of existing profile IDs to dedupe inputs
    existingProfileIds.add(profileId);

    // Recreate a clean URL from the profile ID
    const profileUrl = `https://linkedin.com/in/${profileId}/`;

    // Grab details from the profile page
    try {
      await page.goto(profileUrl, { waitUntil: "domcontentloaded" });

      // Grab the profile details from current page
      const profileDetails = await linkedinGrabProfileDetails(profileId, page);

      if (profileDetails) {
        profileDetails.audit = [`${getTodayISODate()}: Grabbed profile`];

        // Make the object easier to read in JSONL output
        const reorderedProfileDetails = reorderProfileDetails(profileDetails);

        // Add the profile details to the output file as JSONL for master
        humansOutSuccessData.push(reorderedProfileDetails);

        successfulLines++;
        lastSuccessfulProfileId = profileId;

        console.log(`Success: ${profileUrl}`);
      } else {
        // Failed to grab profile details
        failedProfileLines++;
        console.log(`Fail:    ${profileUrl}`);
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

  // Log the summary
  console.log(`Processed:       ${totalLines}`);
  console.log(`Failed grab:     ${failedProfileLines}`);
  console.log(`Successful:      ${successfulLines}`);
  console.log(`Last successful  ${lastSuccessfulProfileId}`);
})();
