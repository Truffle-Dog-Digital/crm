// ---------------------------------------------------------------
// List entries in humansMaster.jsonl that have duplicate names,
// requestSent, and profileIds
// Also console.log unique combinations and check for extra keys
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
  return { data, totalLines };
}

function findExactDuplicates(data) {
  const seen = new Map();
  const duplicates = new Map();

  for (const item of data) {
    const key = `${item.name || ""}-${item.requestSent}-${item.profileId}`;
    if (item.requestSent && item.profileId) {
      if (seen.has(key)) {
        if (!duplicates.has(key)) {
          duplicates.set(key, [seen.get(key)]);
        }
        duplicates.get(key).push(item);
      } else {
        seen.set(key, item);
      }
    }
  }

  return Array.from(duplicates.values()).flat();
}

async function processDuplicates() {
  const masterFile = "humansMaster.jsonl";
  const outputFile = "humansOutFail.jsonl";

  const { data, totalLines } = await readJsonlFile(masterFile);

  const duplicateEntries = findExactDuplicates(data);
  duplicateEntries.sort((a, b) => (a.name || "").localeCompare(b.name || ""));

  const outputLines = duplicateEntries.map((item) => JSON.stringify(item));
  fs.writeFileSync(outputFile, outputLines.join("\n"), "utf8");

  const uniqueCombinations = new Set(
    duplicateEntries.map(
      (item) => `${item.name || ""}-${item.requestSent}-${item.profileId}`
    )
  );

  const extraKeyRecords = duplicateEntries.filter(
    (item) => item.notes || item.channel || item.connected
  );

  console.log("Summary:");
  console.log(`Total records read in: ${totalLines}`);
  console.log(`Total duplicates: ${duplicateEntries.length}`);
  console.log(
    `Total unique combinations of duplicates: ${uniqueCombinations.size}`
  );
  console.log(`Total duplicates with extra keys: ${extraKeyRecords.length}`);

  console.log("Records with extra keys not null (names only):");
  extraKeyRecords.forEach((item) => console.log(item.name));
}

processDuplicates();
