const fs = require("fs");
const { getArrayFromJsonl } = require("./helpers-files");
const path = require("path");

// Dump only "1st" profiles/oldProfiles from humansMaster.jsonl to a text file
// .. usually to give to Philip :)

async function main() {
  const humansMasterFile = "humansMaster.jsonl";
  const outputUrlsFile = "humansMaster-1st-connections-only.txt";

  // Load humans data from humansMaster.jsonl
  const humansArray = await getArrayFromJsonl(humansMasterFile);
  if (!humansArray) {
    console.error("Failed to load humans from JSONL.");
    return;
  }

  const profileUrls = [];

  // Loop through each human and construct URLs for 1st connections only
  humansArray.forEach((human) => {
    const { profileId, oldProfileId, linkedinDistance } = human;

    if (linkedinDistance === "1st") {
      if (profileId) {
        profileUrls.push(`https://www.linkedin.com/in/${profileId}/`);
      }
      if (oldProfileId) {
        profileUrls.push(`https://www.linkedin.com/in/${oldProfileId}/`);
      }
    }
  });

  // Write the URLs to the output file
  fs.writeFileSync(outputUrlsFile, profileUrls.join("\n"), "utf8");

  console.log(
    `1st connection profile URLs exported successfully: ${path.resolve(
      outputUrlsFile
    )}`
  );
  console.log(`Total URLs exported: ${profileUrls.length}`);
}

main();
