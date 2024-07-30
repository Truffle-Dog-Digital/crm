const fs = require("fs").promises;
const { waitForElementToDisappear } = require("./puppeteerSetup");

// Assumes you're already on the LinkedIn profile page and the "Connect" button DOM element is loaded
async function linkedinConnect(testMode, profile, page, customText) {
  try {
    let connectButton = null;
    // Locate the "Connect" button using a CSS selector
    try {
      connectButton = await page.waitForSelector(
        'xpath///div[contains(@class, "ph5")]//span[text()="Connect"]'
      );
    } catch (error) {
      console.log(`No connect button: ${profile}`);
      return false;
    }

    if (connectButton) {
      await page.evaluate((btn) => btn.click(), connectButton);

      // Wait for the "Add a note" button to appear
      const addNoteButton = await page.waitForSelector(
        'button[aria-label="Add a note"]'
      );

      if (addNoteButton) {
        await addNoteButton.click();

        // Wait for the modal to show up
        await page.waitForSelector("#send-invite-modal");

        // Enter the message in the textarea
        await page.type("#custom-message", customText);

        if (testMode) {
          // Click the dismiss "x" button and wait for it to disappear
          const dismissButton = await page.waitForSelector(
            'button[aria-label="Dismiss"]'
          );

          if (dismissButton) {
            await dismissButton.click();
            await waitForElementToDisappear(
              page,
              'button[aria-label="Dismiss"]'
            );
            console.log(`Dismissed invitation: ${profile}`);
          }
        } else {
          // Click the "Send invitation" button and wait for it to disappear
          const sendInvitationButton = await page.waitForSelector(
            'button[aria-label="Send invitation"]'
          );

          if (sendInvitationButton) {
            await sendInvitationButton.click();
            await waitForElementToDisappear(
              page,
              'button[aria-label="Dismiss"]'
            );
            console.log(`Sent invitation: ${profile}`);
          }
        }

        return true;
      }
    } else {
      console.log(`No connect button found`);
      return false;
    }
  } catch (error) {
    console.log(`Catch-all inside linkedinConnect: ${error.message}`);
    return false;
  }
}

module.exports = linkedinConnect;
