const { getProfileId } = require("./helpers-profiles");

const testProfiles = [
  "alana-wilcocks-85260912a",
  "https://www.linkedin.com/in/alana-wilcocks-85260912a/",
  "https://linkedin.com/in/alana-wilcocks-85260912a/",
  "https://www.linkedin.com/in/alana-wilcocks-85260912a",
  "https://linkedin.com/in/alana-wilcocks-85260912a",
  "https://www.linkedin.com/in/alana-wilcocks-85260912a/extra-path",
  "https://linkedin.com/in/",
  "https://www.linkedin.com/in/",
  "https://linkedin.com/in/alana-wilcocks-85260912a/extra/path",
  "https://www.linkedin.com/alana-wilcocks-85260912a",
];

async function testGetProfileId() {
  for (const profile of testProfiles) {
    const profileId = getProfileId(profile);
    console.log(`Input: ${profile}`);
    console.log(`Extracted Profile ID: ${profileId}`);
    console.log("-----------------------------");
  }
}

testGetProfileId();
