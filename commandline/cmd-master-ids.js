const fs = require("fs");
const readline = require("readline");

function extractProfileId(url) {
  const urlParts = url.split("/");
  const profileId =
    urlParts[urlParts.length - 1] || urlParts[urlParts.length - 2];
  return profileId;
}

async function processMasterFile() {
  const inputFile = "humansMaster.jsonl";
  const outputFile = "humansMasterWithIds.jsonl";
  const fileStream = fs.createReadStream(inputFile);
  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity,
  });

  const outputLines = [];

  for await (const line of rl) {
    const trimmedLine = line.trim();
    if (trimmedLine) {
      const json = JSON.parse(trimmedLine);
      if (json.profile) {
        json.profileId = extractProfileId(json.profile);
        delete json.profile;
      }
      outputLines.push(JSON.stringify(json));
    }
  }

  fs.writeFileSync(outputFile, outputLines.join("\n"), "utf8");
}

processMasterFile();
