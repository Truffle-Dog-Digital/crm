const fs = require("fs");
const readline = require("readline");

function extractProfileId(url) {
  const urlParts = url.split("/");
  const profileId =
    urlParts[urlParts.length - 1] || urlParts[urlParts.length - 2];
  return profileId;
}

async function readProfilesFromFile(filePath) {
  const profileIds = new Set();
  const fileStream = fs.createReadStream(filePath);
  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity,
  });

  for await (const line of rl) {
    const trimmedLine = line.trim();
    if (trimmedLine) {
      const standardizedLine = trimmedLine.replace(
        "https://linkedin",
        "https://www.linkedin"
      );
      profileIds.add(extractProfileId(standardizedLine));
    }
  }
  return profileIds;
}

async function readJsonlFile(filePath) {
  const profileIds = new Set();
  const fileStream = fs.createReadStream(filePath);
  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity,
  });

  for await (const line of rl) {
    const trimmedLine = line.trim();
    if (trimmedLine) {
      const json = JSON.parse(trimmedLine);
      profileIds.add(json.profileId);
    }
  }
  return profileIds;
}

async function removeExistingProfiles() {
  const inputProfileIds = await readProfilesFromFile("profilesIn.txt");
  const masterProfileIds = await readJsonlFile("humansMasterWithIds.jsonl");

  const outputProfileIds = [...inputProfileIds].filter(
    (profileId) => !masterProfileIds.has(profileId)
  );

  fs.writeFileSync(
    "profilesOutSuccess.txt",
    outputProfileIds.join("\n"),
    "utf8"
  );
}

removeExistingProfiles();
