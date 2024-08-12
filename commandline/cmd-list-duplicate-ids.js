const fs = require("fs");
const { getArrayFromJsonl } = require("./helpers-files");

function findDuplicateProfileIds(data) {
  const seen = new Map();
  const duplicates = new Map();

  for (const item of data) {
    const profileId = item.profileId;
    const oldProfileId = item.oldProfileId;

    if (profileId) {
      if (seen.has(profileId)) {
        if (!duplicates.has(profileId)) {
          duplicates.set(profileId, [seen.get(profileId)]);
        }
        duplicates.get(profileId).push(item);
      } else {
        seen.set(profileId, item);
      }
    }

    if (oldProfileId) {
      if (seen.has(oldProfileId)) {
        if (!duplicates.has(oldProfileId)) {
          duplicates.set(oldProfileId, [seen.get(oldProfileId)]);
        }
        duplicates.get(oldProfileId).push(item);
      } else {
        seen.set(oldProfileId, item);
      }
    }
  }

  return Array.from(duplicates.values()).flat();
}

async function processDuplicates() {
  const masterFile = "humansMaster.jsonl";
  const outputFile = "humansOutFail.jsonl";

  const data = await getArrayFromJsonl(masterFile);

  if (!data) {
    console.error("Failed to load or parse the master file.");
    return;
  }

  const duplicateProfileIds = findDuplicateProfileIds(data);
  duplicateProfileIds.sort((a, b) =>
    (a.profileId || "").localeCompare(b.profileId || "")
  );

  const outputLines = duplicateProfileIds.map((item) => JSON.stringify(item));

  fs.writeFileSync(outputFile, outputLines.join("\n"), "utf8");

  console.log(
    `Found ${duplicateProfileIds.length} records with duplicate profileIds.`
  );
}

processDuplicates();
