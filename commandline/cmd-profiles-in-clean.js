const { getArrayFromTextFile, getMapFromJsonl } = require("./helpers-files");
const { getProfileId } = require("./helpers-profiles");

const profilesInFile = "profilesIn.txt";
const humansMasterFile = "humansMaster.jsonl";

async function analyzeProfiles() {
  // Read profilesIn.txt into an array
  const inputProfiles = await getArrayFromTextFile(profilesInFile);
  if (!inputProfiles) {
    console.error("Failed to read profiles from profilesIn.txt.");
    return;
  }

  // Read humansMaster.jsonl into a map
  const humansMap = await getMapFromJsonl(humansMasterFile);
  if (!humansMap) {
    console.error("Failed to load humans from humansMaster.jsonl.");
    return;
  }

  const uniqueProfiles = new Set();
  let duplicateCounter = 0;
  let alreadyInDbCounter = 0;

  for (const profile of inputProfiles) {
    const profileId = getProfileId(profile);
    if (!profileId) {
      console.log(`Invalid profile URL or ID: ${profile}`);
      continue;
    }

    if (uniqueProfiles.has(profileId)) {
      console.log(`Duplicate profile ignored: ${profile}`);
      duplicateCounter++;
    } else {
      uniqueProfiles.add(profileId);
      if (humansMap.has(profileId)) {
        alreadyInDbCounter++;
      }
    }
  }

  console.log("Summary:");
  console.log(`Total duplicate profiles ignored: ${duplicateCounter}`);
  console.log(`Total profiles already in the database: ${alreadyInDbCounter}`);
}

analyzeProfiles();
