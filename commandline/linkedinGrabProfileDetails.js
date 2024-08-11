const { getTodayISODate } = require("./helpers-general");
const {
  puppeteerGetNewProfileId,
  puppeteerGetRoles,
} = require("./helpers-puppeteer");

async function linkedinGrabProfileDetails(profileId, page) {
  try {
    // Just in case the page loads slowly, wait for the experience section
    await page.waitForSelector('xpath///section[.//div[@id="experience"]]');

    // See if this profile is an old one with redirects to new one.
    // If so, rearrange profileId and oldProfileId
    const newProfileId = await puppeteerGetNewProfileId(profileId, page);
    let oldProfileId = null;
    if (newProfileId) {
      oldProfileId = profileId;
      profileId = newProfileId;
    }

    // Grab the person's name
    const name = await page.evaluate(() => {
      const element = document.querySelector("div.ph5 h1.text-heading-xlarge");
      return element ? element.textContent.trim() : null;
    });

    // Grab the LinkedIn distance
    const linkedinDistance = await page.evaluate(() => {
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
    const pendingConnectionRequest = await page
      .waitForSelector(
        'xpath///div[contains(@class, "ph5")]//button//span[text()="Pending"]',
        { timeout: 3000 }
      )
      .then(() => true)
      .catch(() => false);

    // Grab current roles, if any
    const roles = await puppeteerGetRoles(page);

    // Record what date we grabbed this profile
    const lastGrabbed = getTodayISODate();

    const newProfile = {
      profileId,
      name,
      linkedinDistance,
      roles,
      lastGrabbed,
      oldProfileId,
      pendingConnectionRequest,
    };

    if (oldProfileId) {
      newProfile.oldProfileId = oldProfileId;
    }

    return newProfile;
  } catch (error) {
    console.error(`Error grabbing profile details for ${profileId}: ${error}`);
    return false;
  }
}

module.exports = linkedinGrabProfileDetails;
