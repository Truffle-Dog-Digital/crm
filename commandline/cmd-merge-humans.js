const fs = require("fs");
const { getArrayFromJsonl } = require("./helpers-files");
const { reorderProfileDetails, mergeHumans } = require("./helpers-profiles");

async function main() {
  const humansInMergeFile = "humansInMerge.jsonl";
  const humansMasterFile = "humansMaster.jsonl";
  const humansOutAuditFile = "humansOutAudit.jsonl";
  const humansOutMasterFile = "humansOutMaster.jsonl";

  // Load arrays from JSONL files
  const humansInArray = await getArrayFromJsonl(humansInMergeFile);
  const humansMasterArray = await getArrayFromJsonl(humansMasterFile);

  if (!humansInArray || !humansMasterArray) {
    console.error("Failed to load one or both JSONL files.");
    return;
  }

  // Create a map for easy lookup of incoming profiles by profileId
  const humansInMap = new Map();
  humansInArray.forEach((human) => {
    if (human.profileId) {
      humansInMap.set(human.profileId, human);
    }
  });

  const duplicateProfileIds = [];
  const outputAuditLines = [];
  const outputMasterOriginalLines = [];
  const outputHumansInOriginalLines = [];
  const outputMasterMergedLines = [];

  let totalMerged = 0;
  let totalMasterOriginal = 0;
  let totalHumansInOriginal = 0;

  // Iterate through the master array and check for updates
  humansMasterArray.forEach((humanMaster) => {
    const profileId = humanMaster.profileId;
    if (profileId && humansInMap.has(profileId)) {
      const humanIn = humansInMap.get(profileId);
      duplicateProfileIds.push(profileId);

      const humanOut = mergeHumans(humanMaster, humanIn);

      // Add "ver" key with "old", "new", and "out" values
      humanMaster.ver = "old";
      humanIn.ver = "new";
      humanOut.ver = "out";

      // Output the master record first, then the new one, then the merged one
      outputAuditLines.push(JSON.stringify(reorderProfileDetails(humanMaster)));
      outputAuditLines.push(JSON.stringify(reorderProfileDetails(humanIn)));
      outputAuditLines.push(JSON.stringify(reorderProfileDetails(humanOut)));

      // Remove "ver" key and prepare for the master output
      delete humanOut.ver;
      outputMasterMergedLines.push(JSON.stringify(humanOut));
      totalMerged++;
    } else {
      // If no duplicate, include it in the master output
      outputMasterOriginalLines.push(
        JSON.stringify(reorderProfileDetails(humanMaster))
      );
      totalMasterOriginal++;
    }
  });

  // Handle remaining new entries from the incoming map that weren't in the master array
  humansInMap.forEach((humanIn, profileId) => {
    if (!duplicateProfileIds.includes(profileId)) {
      outputHumansInOriginalLines.push(
        JSON.stringify(reorderProfileDetails(humanIn))
      );
      totalHumansInOriginal++;
    }
  });

  // Write the audit output to the humansOutAudit.jsonl file in append mode
  fs.appendFileSync(
    humansOutAuditFile,
    outputAuditLines.join("\n") + "\n",
    "utf8"
  );

  // Join the non-duplicate and merged output arrays, adding the merged lines at the end
  const outputAllLines = [
    ...outputMasterOriginalLines,
    ...outputHumansInOriginalLines,
    ...outputMasterMergedLines,
  ];

  // Write the combined master output (non-merged followed by merged) to the humansOutMaster.jsonl file in append mode
  fs.writeFileSync(
    humansOutMasterFile,
    outputAllLines.join("\n") + "\n",
    "utf8"
  );

  const total = totalMasterOriginal + totalHumansInOriginal + totalMerged;
  console.log("");
  console.log(`Originals inserted from Master:   ${totalMasterOriginal}`);
  console.log(`Originals inserted from HumansIn: ${totalHumansInOriginal}`);
  console.log(`Merged entries inserted:          ${totalMerged}`);
  console.log(`Total lines in resulting file:    ${total}`);
}

main();
