const {
  waitForElement,
  waitForElementToDisappear,
} = require("./helpers-puppeteer-xpath");
const fs = require("fs");
const getISODateFrom = require("./helpers-general").getISODateFrom;

// We use this a few times
const dismissButtonSelector =
  '//div[@data-test-modal]//button[@aria-label="Dismiss"]';

// Get contact details from the "Contact info" dialog/overlay
async function puppeteerGetContactDetails(profile, page) {
  try {
    // Find and click the anchor with href containing "/overlay/contact-info/"
    const contactInfoElement = await waitForElement(
      page,
      "//a[@id='top-card-text-details-contact-info']"
    );
    if (contactInfoElement) {
      await page.evaluate((el) => el.click(), contactInfoElement);

      // Wait for the dismiss button to appear, keep it for closing the dialog later
      var dismissButton = await waitForElement(page, dismissButtonSelector);

      if (dismissButton) {
        // Wait for the contact info sections to appear
        const sectionSelector =
          "//section[contains(@class, 'pv-contact-info__contact-type') and .//h3]";

        const oneSection = await waitForElement(page, sectionSelector);

        if (oneSection) {
          // Evaluate the page to extract contact info sections
          const contactInfo = await page.evaluate((sectionSelector) => {
            const xpathResult = document.evaluate(
              sectionSelector,
              document,
              null,
              XPathResult.ORDERED_NODE_SNAPSHOT_TYPE,
              null
            );

            const sections = [];
            for (let i = 0; i < xpathResult.snapshotLength; i++) {
              sections.push(xpathResult.snapshotItem(i));
            }

            const contactDetails = {};

            sections.forEach((section, index) => {
              // Grab two child elements we're interested in
              const section2ndChild = section.children[1];
              const section3rdChild = section.children[2];

              // Extract the key from the 2nd child
              const key = "linkedin" + section2ndChild.innerText.trim();

              // Grab the value from the 3rd child
              let value = "";
              if (section3rdChild.tagName.toLowerCase() === "ul") {
                value = section3rdChild.querySelector("a")?.innerText.trim();
              } else {
                value = section3rdChild?.innerText.trim();
              }

              // Add the key-value pair to the contact details
              contactDetails[key] = value;
            });

            return contactDetails;
          }, sectionSelector); // Pass the XPath selector as an argument here

          // Pass sectionSelector as an argument here
          // The first object in contactDetails is the user's CURRENT profile.
          // if it's different from the profile we navigated to,
          // store oldProfileId and profileId appropriately
          const newProfileId = Object.values(contactInfo)[0].split("/").pop();
          if (newProfileId !== profile.profileId) {
            profile.oldProfileId = profile.profileId;
            profile.profileId = newProfileId;
            console.log(
              `==== check master file for duplicates  (old:${profile.oldProfileId} new:${profile.profileId}) ====`
            );
          }

          // Check we have at least one contact detail, otherwise it's an edge case we haven't handled
          if ((Object.keys(contactInfo).length = 0)) {
            throw new Error(
              `Found a section, but post-processing there are none left: ${profile.profileId}`
            );
          }

          // Add contact details to the profile object (skip profile, we've done that already)
          Object.entries(contactInfo).forEach(([key, value], index) => {
            if (index > 0) {
              if (key == "linkedinConnected")
                // Reformat the linkedin date to ISO format
                profile[key] = getISODateFrom(value);
              else profile[key] = value;
            }
          });
        } else {
          throw new Error(
            `No contact sections found, expect at least one: ${profile.profileId}`
          );
        }

        // Click the dismiss button
        dismissButton = await waitForElement(page, dismissButtonSelector);
        await page.evaluate((el) => el.click(), dismissButton);

        // Wait for the dismiss button to disappear
        const dismissed = await waitForElementToDisappear(
          page,
          dismissButtonSelector
        );

        if (!dismissed) {
          throw new Error(
            `Couldn't dismiss contacts dialog: ${profile.profileId}`
          );
        }
      } else {
        throw new Error(
          `Contacts dialog did not load as expected: ${profile.profileId}`
        );
      }
    } else {
      throw new Error(`Contact info link not found: ${profile.profileId}`);
    }
  } catch (error) {
    throw new Error(
      `Error in puppeteerGetContactDetails: ${profile.profileId}...\n${error.message}`
    );
  }
}

module.exports = {
  puppeteerGetContactDetails,
};
