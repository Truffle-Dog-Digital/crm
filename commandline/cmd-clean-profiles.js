const fs = require("fs");
const readline = require("readline");

async function readProfilesFromFile(filePath) {
  const profiles = new Set();
  const fileStream = fs.createReadStream(filePath);
  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity,
  });

  for await (const line of rl) {
    const trimmedLine = line.trim();
    if (trimmedLine) {
      profiles.add(trimmedLine);
    }
  }
  return profiles;
}

async function readJsonlFile(filePath) {
  const profiles = new Set();
  const fileStream = fs.createReadStream(filePath);
  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity,
  });

  for await (const line of rl) {
    const trimmedLine = line.trim();
    if (trimmedLine) {
      const json = JSON.parse(trimmedLine);
      profiles.add(json.profile);
    }
  }
  return profiles;
}

async function removeExistingProfiles() {
  const inputProfiles = await readProfilesFromFile("profilesIn.txt");
  const masterProfiles = await readJsonlFile("humansMaster.jsonl");

  const outputProfiles = [...inputProfiles].filter(
    (profile) => !masterProfiles.has(profile)
  );

  fs.writeFileSync("profilesOutSuccess.txt", outputProfiles.join("\n"), "utf8");
}

removeExistingProfiles();
