// ---------------------------------------------------------------
// List entries in humansMaster.jsonl that do not have a profileId
// ---------------------------------------------------------------

const fs = require("fs");
const readline = require("readline");

async function readNamesWithoutProfileId() {
  const inputFile = "humansMaster.jsonl";
  const outputFile = "profilesOutSuccess.txt";
  const fileStream = fs.createReadStream(inputFile);
  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity,
  });

  const names = [];

  for await (const line of rl) {
    const trimmedLine = line.trim();
    if (trimmedLine) {
      const json = JSON.parse(trimmedLine);
      if (!json.profileId && json.name) {
        names.push(json.name);
      }
    }
  }

  fs.writeFileSync(outputFile, names.join("\n"), "utf8");
}

readNamesWithoutProfileId();
