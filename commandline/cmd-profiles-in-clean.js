const fs = require("fs").promises;
const { getArrayFromTextFile, getArrayFromJsonl } = require("./helpers-files");
const { getProfileId } = require("./helpers-profiles");

const profilesInFile = "profilesIn.txt";
const humansMasterFile = "humansMaster.jsonl";
const profilesOutSuccessFile = "profilesOutSuccess.txt";

async function analyzeProfiles() {
  // Read profilesIn.txt into an array
  const inputProfiles = await getArrayFromTextFile(profilesInFile);
  if (!inputProfiles) {
    console.error("Failed to read profiles from profilesIn.txt.");
    return;
  }

  // Read humansMaster.jsonl into an array
  const humansArray = await getArrayFromJsonl(humansMasterFile);
  if (!humansArray) {
    console.error("Failed to load humans from humansMaster.jsonl.");
    return;
  }

  // Create a set of existing profile IDs from humansArray
  const existingProfileIds = new Set(
    humansArray.map((human) => human.profileId)
  );

  const uniqueProfiles = new Set();
  const cleanedProfileIds = [];
  let duplicateCounter = 0;
  let alreadyInDbCounter = 0;

  for (const profile of inputProfiles) {
    const profileId = getProfileId(profile);
    if (!profileId) {
      console.log(`Invalid profile URL or ID: ${profile}`);
      continue;
    }

    if (uniqueProfiles.has(profileId)) {
      duplicateCounter++;
    } else {
      uniqueProfiles.add(profileId);
      if (existingProfileIds.has(profileId)) {
        alreadyInDbCounter++;
      } else {
        cleanedProfileIds.push(profileId);
      }
    }
  }

  console.log("Summary:");
  console.log(`Total duplicate profiles ignored: ${duplicateCounter}`);
  console.log(`Total profiles already in the database: ${alreadyInDbCounter}`);

  // Write cleaned profile IDs to profilesOutSuccess.txt
  await fs.writeFile(
    profilesOutSuccessFile,
    cleanedProfileIds.join("\n"),
    "utf8"
  );
}

analyzeProfiles();
