const syncFs = require("fs");
const fs = require("fs").promises;
const linkedinCleanCookies = require("./linkedinCleanCookies");
const { createPage } = require("./helpers-puppeteer-setup");
const linkedinGrabProfileDetails = require("./linkedinGrabProfileDetails");
const linkedinConnect = require("./linkedinConnect");
const { getProfileId, reorderProfileDetails } = require("./helpers-profiles");
const { getArrayFromTextFile, getArrayFromJsonl } = require("./helpers-files");
const { getTodayISODate } = require("./helpers-general");

// Configuration
const testMode = false;
const headless = false;
const inputFileCookies = "linkedinCookies.json";
const profilesIn = "profilesInRequestConnection.txt";
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

  // Load the humans master data as an array
  const humansArray = await getArrayFromJsonl(humansMaster);
  if (!humansArray) {
    console.error("Failed to load humans from JSONL.");
    return;
  }

  // Create a set of existing profile IDs to dedupe connection requests
  const existingProfileIds = new Set(
    humansArray
      .flatMap((human) => [human.profileId, human.oldProfileId])
      .filter((id) => id !== undefined && id !== null)
  );

  // Setup Puppeteer with cleaned Linkedin cookies
  const { browser, page } = await createPage(cleanedCookies, headless);

  // Set up a bunch of counters for reporting at the end
  let totalLines = 0;
  let successfulLines = 0;
  let preexistingLines = 0;
  let pendingConnections = 0;
  let alreadyConnectedLines = 0;
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

    // If the profile ID is not valid skip it
    if (!profileId) {
      console.log(`Couldn't get id from:  ${profileInString}`);
      profilesOutFailData.push(profileInString);
      continue;
    }

    // If the profile ID is already in our DB, skip it
    if (existingProfileIds.has(profileId)) {
      console.log(`Profile ID ${profileId} already in DB, skipping.`);
      preexistingLines++;
      continue;
    }

    // Recreate a clean URL from the profile ID
    const profileUrl = `https://linkedin.com/in/${profileId}/`;

    // Grab details from the profile page and send a connection request
    try {
      await page.goto(profileUrl, { waitUntil: "domcontentloaded" });

      // Grab the profile details from the current page
      const profileDetails = await linkedinGrabProfileDetails(profileId, page);

      if (profileDetails) {
        // Already connected
        if (profileDetails.linkedinDistance === "1st") {
          alreadyConnectedLines++;
          profileDetails.audit = [`${getTodayISODate()}: Grabbed profile`];
          humansOutSuccessData.push(reorderProfileDetails(profileDetails));
          console.log(`Already connected:    ${profileUrl}`);
          continue;
        }

        // Pending connection request
        if (profileDetails.pendingConnectionRequest) {
          pendingConnections++;
          profileDetails.audit = [`${getTodayISODate()}: Grabbed profile`];
          humansOutSuccessData.push(reorderProfileDetails(profileDetails));
          console.log(`Already pending:      ${profileUrl}`);
          continue;
        }

        // Try to send a connection request
        const connectionRequested = await linkedinConnect(
          testMode,
          profileUrl,
          page,
          customText
        );

        if (connectionRequested) {
          profileDetails.pendingConnectionRequest = true;
          profileDetails.customText = customText;
          profileDetails.requestLastSent = getTodayISODate();
          profileDetails.audit = [
            `${getTodayISODate()}: Sent connection request`,
          ];

          // Check if the profile is already in the DB
          if (
            existingProfileIds.has(profileDetails.profileId) ||
            (profileDetails.oldProfileId &&
              existingProfileIds.has(profileDetails.oldProfileId))
          ) {
            console.log(
              `Profile ${profileDetails.profileId} already in DB - manual check`
            );
          } else {
            profileDetails.firstContact = getTodayISODate();
          }

          // Reorder and save profile details
          humansOutSuccessData.push(reorderProfileDetails(profileDetails));

          successfulLines++;
          lastSuccessfulProfileId = profileId;
        } else {
          console.log(`Failed to send request:   ${profileUrl}`);
          profilesOutFailData.push(profileInString);
        }
      } else {
        failedProfileLines++;
        console.log(`Failed profile grab:   ${profileUrl}`);
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
  await fs.appendFile(
    humansOutSuccess,
    humansOutSuccessData.map((item) => JSON.stringify(item)).join("\n") + "\n",
    "utf8"
  );
  await fs.appendFile(profilesOutFail, profilesOutFailData.join("\n"), "utf8");

  // Log the summary
  console.log(`Processed:         ${totalLines}`);
  console.log(`Already in DB:     ${preexistingLines}`);
  console.log(`Already pending:   ${pendingConnections}`);
  console.log(`Already connected: ${alreadyConnectedLines}`);
  console.log(`Failed grab:       ${failedProfileLines}`);
  console.log(`Successful:        ${successfulLines}`);
  console.log(`Last successful:   ${lastSuccessfulProfileId}`);
})();
