const {
  waitForElement,
  waitForElementToDisappear,
} = require("./helpers-puppeteer-xpath");
const fs = require("fs");

// Get contact details from the "Contact info" dialog/overlay
async function puppeteerGetContactDetails(profile, page) {
  try {
    // Find and click the anchor with href containing "/overlay/contact-info/"
    const contactInfoElement = await waitForElement(
      page,
      "//a[@id='top-card-text-details-contact-info']"
    );

    if (contactInfoElement) {
      console.log("Contact link found, clicking it");
      await page.evaluate((el) => el.click(), contactInfoElement);
      console.log("Contact link clicked");

      // Wait for the dismiss button to appear, keep it for closing the dialog later
      const dismissButton = await waitForElement(
        page,
        '//div[@data-test-modal]//button[@aria-label="Dismiss"]'
      );

      if (dismissButton) {
        console.log("Contact dialog open");

        // Wait for the contact info sections to appear
        const oneSection = await waitForElement(
          page,
          "//section[contains(@class, 'pv-contact-info__contact-type')]"
        );

        if (oneSection) {
          console.log("Section found");

          // Evaluate the page to extract contact info sections, ignoring the first one
          const contactInfo = await page.evaluate(() => {
            const sections = Array.from(
              document.querySelectorAll("section.pv-contact-info__contact-type")
            );
            const contactDetails = {};

            sections.slice(1).forEach((section, index) => {
              // Skip the first section
              const key = section
                .querySelector("h3")
                ?.innerText.trim()
                .toLowerCase();
              const sibling = section.querySelector("h3").nextElementSibling;
              let value = "";

              if (sibling.tagName.toLowerCase() === "ul") {
                value = sibling.querySelector("a")?.innerText.trim();
              } else {
                value = sibling?.innerText.trim();
              }

              if (key === "connected") {
                const [month, day, year] = value.split(" ");
                const months = {
                  Jan: "01",
                  Feb: "02",
                  Mar: "03",
                  Apr: "04",
                  May: "05",
                  Jun: "06",
                  Jul: "07",
                  Aug: "08",
                  Sep: "09",
                  Oct: "10",
                  Nov: "11",
                  Dec: "12",
                };
                value = `${year}-${months[month]}-${day
                  .replace(",", "")
                  .padStart(2, "0")}`;
              }

              if (!key || !value) {
                console.error(
                  `Null detected at Section ${
                    index + 2
                  }: key: ${key}, value: ${value}`
                );
              } else {
                console.log(
                  `Section ${index + 2}: key: ${key}, value: ${value}`
                );
              }
              contactDetails[key] = value;
            });

            return contactDetails;
          });

          // Add contact details to the profile object
          profile.contactDetails = contactInfo;
          console.log("Extracted contact details:", contactInfo);
        } else {
          console.log("No additional contact sections found.");
        }

        // Capture a screenshot of the dialog
        await page.screenshot({ path: "log.png" });
        console.log("Screenshot captured and saved as log.png");

        // Click the dismiss button
        const xButton = await waitForElement(
          page,
          '//div[@data-test-modal]//button[@aria-label="Dismiss"]'
        );
        console.log("Clicking dismiss button");
        console.log(xButton);
        await page.evaluate((el) => el.click(), xButton);

        // Wait for the dismiss button to disappear
        const dismissed = await waitForElementToDisappear(
          page,
          '//div[@data-test-modal]//button[@aria-label="Dismiss"]'
        );
        console.log("XPath absent has returned");

        if (dismissed) {
          console.log("Dismissed contact dialog successfully");
        } else {
          console.log("Failed to dismiss contact dialog successfully");
          throw new Error("Couldn't dismiss contacts dialog");
        }
      } else {
        throw new Error("Contacts dialog did not load as expected.");
      }
    } else {
      throw new Error("Contact info link not found.");
    }
  } catch (error) {
    console.error(`Error in puppeteerGetContactDetails: ${error.message}`);
  }
}

module.exports = {
  puppeteerGetContactDetails,
};
