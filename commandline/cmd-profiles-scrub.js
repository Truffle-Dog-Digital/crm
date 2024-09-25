const fs = require("fs");
const { getArrayFromTextFile, getArrayFromJsonl } = require("./helpers-files");
const { getProfileId } = require("./helpers-profiles");

async function main() {
  const profilesInFile = "profilesInScrub.txt";
  const humansMasterFile = "humansMaster.jsonl";
  const profilesOutScrubbedFile = "profilesOutScrubbed.txt";

  // Load profiles from profilesInScrub.txt
  const profilesInArray = await getArrayFromTextFile(profilesInFile);

  // Load humans data from humansMaster.jsonl
  const humansArray = await getArrayFromJsonl(humansMasterFile);
  if (!humansArray) {
    console.error("Failed to load humans from JSONL.");
    return;
  }

  // Create a set of existing profile IDs and oldProfileIds for quick lookups
  const existingProfileIds = new Set();
  humansArray.forEach((human) => {
    if (human.profileId) {
      existingProfileIds.add(human.profileId);
    }
    if (human.oldProfileId) {
      existingProfileIds.add(human.oldProfileId);
    }
  });

  // Filter out profiles that are already in the master
  const profilesOutScrubbed = profilesInArray.filter((profileInString) => {
    const profileId = getProfileId(profileInString);
    return profileId && !existingProfileIds.has(profileId);
  });

  // Write the scrubbed profiles to profilesOutScrubbed.txt
  await fs.promises.writeFile(
    profilesOutScrubbedFile,
    profilesOutScrubbed.join("\n") + "\n",
    "utf8"
  );

  console.log(`${profilesOutScrubbed.length} profiles survived the scrub.`);
}

main();
