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

  // Read input profiles from file (line delimited text)
  const profilesInArray = await getArrayFromTextFile(profilesIn);

  // Read custom connection text from file (line delimited text)
  const customText = await fs.readFile(linkedinCustomConnectionText, "utf8");

  // Read the master "database" of humans (JSONL)
  const humansData = await getMapFromJsonl(humansMaster);
  if (!humansData) {
    console.error("Failed to load humans from JSONL.");
    return;
  }

  // Create a set of existing profile IDs to dedupe connection requests
  const existingProfileIds = new Set(
    Array.from(humansData.values()).map((human) => human.profileId)
  );

  // Setup Puppeteer with cleaned Linkedin cookies
  const { browser, page } = await createPage(cleanedCookies, headless);

  // Set up a bunch of counters for reporting at the end
  let totalLines = 0;
  let successfulLines = 0;
  let preexistingLine = 0;
  let failedProfileLines = 0;
  let lastSuccessfulProfileId = null;
  const profilesOutFailData = [];
  const humansOutSuccessData = [];

  // Loop through each profile in the input file
  for (const profileInString of profilesInArray) {
    if (successfulLines >= maxSuccessfulProfiles) {
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

    // Grab details from the profile page and send a connection request
    try {
      await page.goto(profileUrl, { waitUntil: "domcontentloaded" });

      // Grab the profile details from current page
      const profileDetails = await linkedinGrabProfileDetails(page);

      if (profileDetails) {
        profileDetails.profileId = profileId;
        profileDetails.customText = customText;
        profileDetails.requestSent = getTodayISODate();

        // Send a connection request
        const connectionRequested = await linkedinConnect(
          testMode,
          profileUrl,
          page,
          customText
        );

        if (connectionRequested) {
          // Make the object easier to read in JSONL output
          const reorderedProfileDetails = reorderProfileDetails(profileDetails);

          // Add the profile details to the output file as JSONL for master
          humansOutSuccessData.push(reorderedProfileDetails);

          successfulLines++;
          lastSuccessfulProfileId = profileId;
        } else {
          profilesOutFailData.push(profileInString);
        }
      } else {
        // Failed to grab profile details
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

  // Log the summary
  console.log(`Processed:       ${totalLines}`);
  console.log(`Already in DB:   ${preexistingLine}`);
  console.log(`Failed grab:     ${failedProfileLines}`);
  console.log(`Successful:      ${successfulLines}`);
  console.log(`Last successful  ${lastSuccessfulProfileId}`);
})();
