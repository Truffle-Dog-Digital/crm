const syncFs = require("fs");
const fs = require("fs").promises;
const puppeteer = require("puppeteer-core");
const readline = require("readline");

// Function to clean cookies
async function cleanCookies(filePath) {
  try {
    const data = await fs.readFile(filePath, "utf8");
    let cookies = JSON.parse(data);

    cookies = cookies.map((cookie) => {
      if (cookie.sameSite === null) {
        cookie.sameSite = "None";
      } else if (cookie.sameSite.toLowerCase() === "lax") {
        cookie.sameSite = "Lax";
      } else if (cookie.sameSite.toLowerCase() === "no_restriction") {
        cookie.sameSite = "None";
      }
      return cookie;
    });

    return cookies;
  } catch (error) {
    console.error("Error reading or cleaning cookies:", error);
    throw error;
  }
}

// Function to extract the profile ID from the URL
function extractProfileId(url) {
  const match = url.match(/\/in\/([^\/]*)/);
  return match ? match[1] : null;
}

// Function to create a delay
const delay = (timeout) =>
  new Promise((resolve) => setTimeout(resolve, timeout));

// Main function
(async () => {
  const browser = await puppeteer.launch({
    headless: false,
    executablePath:
      "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
    args: ["--window-size=1920,1080"],
  });
  const page = await browser.newPage();

  // Set the viewport to a realistic size
  await page.setViewport({ width: 1024, height: 1024 });

  // Increase the navigation timeout
  page.setDefaultNavigationTimeout(10000); // 10 seconds

  // Clean existing cookies
  await page.deleteCookie(...(await page.cookies()));

  // Read and clean cookies from cookies.json
  const cookiesFilePath = "cookies.json";
  const cleanedCookies = await cleanCookies(cookiesFilePath);

  // Set cleaned cookies
  await page.setCookie(...cleanedCookies);

  // Read LinkedIn profile URLs from profiles.txt
  const profiles = (await fs.readFile("profiles.txt", "utf8"))
    .split("\n")
    .filter(Boolean);

  // Create a write stream for logging using the synchronous fs module
  const logStream = syncFs.createWriteStream("connect.log");

  // Function to log messages
  const log = (message) => {
    console.log(message);
    logStream.write(`${new Date().toISOString()} - ${message}\n`);
  };

  for (const profile of profiles) {
    try {
      const profileId = extractProfileId(profile);
      if (!profileId) {
        log(`Invalid profile URL: ${profile}`);
        continue;
      }

      // Wait for the "other similar profiles" section to load
      // because that defs happens before the main "connect" buttons
      await page.goto(profile, { waitUntil: "domcontentloaded" });
      await page.waitForSelector(
        'xpath///section[contains(@class, "pv-profile-card")]//a[@aria-label="Show all other similar profiles"]'
      );

      // Check for the real, actual "Connect" button
      // Not the ones that relate to randoms, just the one that connects with your chosen person
      //
      // NOTE: This can take one of three forms, and in one case it's two forms at once
      //   * primary connect shows, bright blue mother
      //   * secondary connect shows, gray mother ("only connect if you know me")
      //      * in this case, the third option is also present
      //   * tertiary - the only "connect" option is hidden behind the "more" button
      //
      const connectSpan = await page.waitForSelector(
        'xpath///section[@data-member-id]//span[contains(., "Connect")]'
      );

      // Let's grab the person's name and a list of their "Present" positions

      // const personName = await page.evaluate(() => {
      //   const element = document.querySelector(
      //     "div.ph5.pb5 h1.text-heading-xlarge"
      //   );
      //   return element ? element.textContent.trim() : null;
      // });
      // console.log(personName);

      // if (connectSpan) {
      //   log(`Found the connect button for ${profile}`);
      //   await page.evaluate((span) => span.click(), connectSpan);

      //   // Wait for the "Add a note" button to appear
      //   const addNoteButton = await page.waitForSelector(
      //     'button[aria-label="Add a note"]'
      //   );

      //   if (addNoteButton) {
      //     await addNoteButton.click();

      //     // Wait for the modal to show up
      //     await page.waitForSelector("#send-invite-modal");

      //     // Enter the message in the textarea
      //     await page.type(
      //       "#custom-message",
      //       "You popped up in my feed and you look like someone who works outside the box :)"
      //     );

      //     // Wait for 3 seconds to observe the result
      //     await delay(3000);

      //     // Click the "Send invitation" button
      //     const sendInvitationButton = await page.waitForSelector(
      //       'button[aria-label="Send invitation"]'
      //     );
      //     if (sendInvitationButton) {
      //       await sendInvitationButton.click();
      //       log(`Sent invitation for ${profile}`);
      //     }
      //   }
      // }
    } catch (error) {
      log(`Failed to connect to ${profile}: ${error.message}`);
    }
  }

  await browser.close();
  logStream.end();
})();
