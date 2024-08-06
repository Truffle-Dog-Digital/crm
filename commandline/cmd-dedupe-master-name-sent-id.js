// ---------------------------------------------------------------
// Deduplicate entries in humansMaster.jsonl by name, requestSent, and profileId
// -> output unique entries to humansOutSuccess.jsonl
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

async function deduplicateEntries() {
  const masterFile = "humansMaster.jsonl";
  const outputFile = "humansOutSuccess.jsonl";

  const { data, totalLines } = await readJsonlFile(masterFile);

  const uniqueEntries = [];
  const seenCombinations = new Set();

  data.forEach((item) => {
    const combinationKey = `${item.name}-${item.requestSent}-${item.profileId}`;
    if (!seenCombinations.has(combinationKey)) {
      seenCombinations.add(combinationKey);
      uniqueEntries.push(item);
    } else {
      console.log(
        `Discarded: name=${item.name}, requestSent=${item.requestSent}, profileId=${item.profileId}`
      );
    }
  });

  const outputLines = uniqueEntries.map((item) => JSON.stringify(item));
  fs.writeFileSync(outputFile, outputLines.join("\n"), "utf8");

  console.log("Summary:");
  console.log(`Total lines read: ${totalLines}`);
  console.log(`Total lines output: ${uniqueEntries.length}`);
  console.log(`Difference: ${totalLines - uniqueEntries.length}`);
}

deduplicateEntries();
