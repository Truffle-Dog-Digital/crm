// ---------------------------------------------------------------
// List entries in humansMaster.jsonl that have duplicate profileIds
// -> output to humansOutFail.jsonl
// ---------------------------------------------------------------

const fs = require("fs");
const readline = require("readline");

async function readJsonlFile(filePath) {
  const data = [];
  const fileStream = fs.createReadStream(filePath);
  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity,
  });

  let totalLines = 0;

  for await (const line of rl) {
    const trimmedLine = line.trim();
    if (trimmedLine) {
      const json = JSON.parse(trimmedLine);
      data.push(json);
      totalLines++;
    }
  }

  console.log(`Total lines read: ${totalLines}`);
  return data;
}

function findDuplicateProfileIds(data) {
  const seen = new Map();
  const duplicates = new Map();

  for (const item of data) {
    const profileId = item.profileId;
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
  }

  return Array.from(duplicates.values()).flat();
}

async function processDuplicates() {
  const masterFile = "humansMaster.jsonl";
  const outputFile = "humansOutFail.jsonl";

  const data = await readJsonlFile(masterFile);

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
