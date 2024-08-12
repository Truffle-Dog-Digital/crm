const { getTodayISODate, timeStamp } = require("./helpers-general");
const {
  puppeteerGetContactDetails,
} = require("./helpers-puppeteer-get-contact-details");
const { puppeteerGetRoles } = require("./helpers-puppeteer");

async function linkedinGrabProfileDetails(profileId, page) {
  try {
    var newProfile = { profileId };

    // Just in case the page loads slowly, wait for the experience section
    await page.waitForSelector('xpath///section[.//div[@id="experience"]]');

    // Grab the person's name
    newProfile.name = await page.evaluate(() => {
      const element = document.querySelector("div.ph5 h1.text-heading-xlarge");
      return element ? element.textContent.trim() : null;
    });

    // Grab the LinkedIn distance
    newProfile.linkedinDistance = await page.evaluate(() => {
      const element = document.evaluate(
        "//div[contains(@class, 'ph5')]//span[contains(@class, 'distance-badge')]//span[contains(@class, 'dist-value')]",
        document,
        null,
        XPathResult.FIRST_ORDERED_NODE_TYPE,
        null
      ).singleNodeValue;
      return element ? element.textContent.trim() : null;
    });

    // Check for a "Pending" connection request
    newProfile.pendingConnectionRequest = await page
      .waitForSelector(
        'xpath///div[contains(@class, "ph5")]//button//span[text()="Pending"]',
        { timeout: 500 }
      )
      .then(() => true)
      .catch(() => false);

    // Grab current roles, if any
    await puppeteerGetRoles(newProfile, page);

    // Grab contact details
    await puppeteerGetContactDetails(newProfile, page);

    // Record what date we grabbed this profile
    newProfile.lastGrabbed = getTodayISODate();

    return newProfile;
  } catch (error) {
    console.error(`Error grabbing profile details for ${profileId}: ${error}`);
    return false;
  }
}

module.exports = linkedinGrabProfileDetails;
