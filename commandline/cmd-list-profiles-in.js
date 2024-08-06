// ---------------------------------------------------------------
// check profilesIn.txt for validity
// -> output to console.log
// ---------------------------------------------------------------

const fs = require("fs");
const readline = require("readline");
const { getProfileId } = require("./helpers-profiles.js");

async function processProfiles(inputFile) {
  const fileStream = fs.createReadStream(inputFile);
  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity,
  });

  let totalLines = 0;
  let successfulLines = 0;
  const profiles = [];

  for await (const line of rl) {
    const trimmedLine = line.trim();
    if (trimmedLine) {
      totalLines++;
      const profileId = getProfileId(trimmedLine);
      if (profileId) {
        profiles.push(profileId);
        successfulLines++;
      }
    }
  }

  profiles.forEach((profile) => console.log(profile));

  console.log("Summary:");
  console.log(`Total non-blank lines input: ${totalLines}`);
  console.log(`Total successful profiles processed: ${successfulLines}`);
}

processProfiles("profilesIn.txt");

/* 

Test data for profilesIn.txt

alana-wilcocks-85260912a
https://www.linkedin.com/in/alana-wilcocks-85260912a/
https://linkedin.com/in/alana-wilcocks-85260912a/
https://www.linkedin.com/in/alana-wilcocks-85260912a
https://linkedin.com/in/alana-wilcocks-85260912a
https://www.linkedin.com/in/alana-wilcocks-85260912a/extra-path
https://linkedin.com/in/
https://www.linkedin.com/in/
https://linkedin.com/in/alana-wilcocks-85260912a/extra/path
https://www.linkedin.com/alana-wilcocks-85260912a

*/
