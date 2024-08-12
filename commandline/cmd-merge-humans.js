const fs = require("fs");
const { getArrayFromJsonl } = require("./helpers-files");
const { reorderProfileDetails, mergeHumans } = require("./helpers-profiles");

async function main() {
  const humansInFile = "humansIn.jsonl";
  const humansMasterFile = "humansMaster.jsonl";
  const humansOutDiffsFile = "humansOutDiffs.jsonl";

  // Load arrays from JSONL files
  const humansInArray = await getArrayFromJsonl(humansInFile);
  const humansMasterArray = await getArrayFromJsonl(humansMasterFile);

  if (!humansInArray || !humansMasterArray) {
    console.error("Failed to load one or both JSONL files.");
    return;
  }

  // Create a map for easy lookup of master profiles by profileId
  const masterMap = new Map();
  humansMasterArray.forEach((human) => {
    if (human.profileId) {
      masterMap.set(human.profileId, human);
    }
  });

  const duplicateProfileIds = [];
  const outputLines = [];

  // Find duplicates and output them
  humansInArray.forEach((humanIn) => {
    const profileId = humanIn.profileId;
    if (profileId && masterMap.has(profileId)) {
      const humanMaster = masterMap.get(profileId);
      duplicateProfileIds.push(profileId);

      const humanOut = mergeHumans(humanMaster, humanIn);

      // Add "ver" key with "old" and "new" values
      humanMaster.ver = "old";
      humanIn.ver = "new";
      humanOut.ver = "out";

      // Output the master record first, then the new one
      outputLines.push(JSON.stringify(reorderProfileDetails(humanMaster)));
      outputLines.push(JSON.stringify(reorderProfileDetails(humanIn)));
      outputLines.push(JSON.stringify(reorderProfileDetails(humanOut)));
    }
  });

  // Write the output to the humansOutDiffs.jsonl file
  fs.writeFileSync(humansOutDiffsFile, outputLines.join("\n"), "utf8");

  console.log(
    `Found ${duplicateProfileIds.length} duplicates. Output written to ${humansOutDiffsFile}.`
  );
}

main();
