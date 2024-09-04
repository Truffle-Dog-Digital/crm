const fs = require("fs");
const { getArrayFromJsonl } = require("./helpers-files");
const path = require("path");

// Dump all profiles and oldProfiles from humansMaster.jsonl to a text file
// .. usually to give to Philip :)

async function main() {
  const humansMasterFile = "humansMaster.jsonl";
  const outputUrlsFile = "humansMaster-all-profiles-only.txt";

  // Load humans data from humansMaster.jsonl
  const humansArray = await getArrayFromJsonl(humansMasterFile);
  if (!humansArray) {
    console.error("Failed to load humans from JSONL.");
    return;
  }

  const profileUrls = [];

  // Loop through each human and construct URLs
  humansArray.forEach((human) => {
    const { profileId, oldProfileId } = human;

    if (profileId) {
      profileUrls.push(`https://www.linkedin.com/in/${profileId}/`);
    }

    if (oldProfileId) {
      profileUrls.push(`https://www.linkedin.com/in/${oldProfileId}/`);
    }
  });

  // Write the URLs to the output file
  fs.writeFileSync(outputUrlsFile, profileUrls.join("\n"), "utf8");

  console.log(
    `Profile URLs exported successfully: ${path.resolve(outputUrlsFile)}`
  );
}

main();
