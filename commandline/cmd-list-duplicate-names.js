// ---------------------------------------------------------------
// List entries in humansMaster.jsonl that have duplicate names
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

function findDuplicateNames(data) {
  const seen = new Map();
  const duplicates = new Map();

  for (const item of data) {
    const name = item.name;
    if (name) {
      if (seen.has(name)) {
        if (!duplicates.has(name)) {
          duplicates.set(name, [seen.get(name)]);
        }
        duplicates.get(name).push(item);
      } else {
        seen.set(name, item);
      }
    }
  }

  return Array.from(duplicates.values()).flat();
}

async function processDuplicates() {
  const masterFile = "humansMaster.jsonl";
  const outputFile = "humansOutFail.jsonl";

  const data = await readJsonlFile(masterFile);

  const duplicateNames = findDuplicateNames(data);
  duplicateNames.sort((a, b) => a.name.localeCompare(b.name));

  const outputLines = duplicateNames.map((item) => JSON.stringify(item));

  fs.writeFileSync(outputFile, outputLines.join("\n"), "utf8");

  console.log(`Found ${duplicateNames.length} records with duplicate names.`);
}

processDuplicates();
