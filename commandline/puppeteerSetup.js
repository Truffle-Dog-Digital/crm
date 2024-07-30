const puppeteer = require("puppeteer-core");

// Function to create a browser and set up a new page with cookies
async function createPage(cleanedCookies, headless) {
  const browser = await puppeteer.launch({
    headless: headless,
    executablePath:
      "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
    args: ["--window-size=1920,1080"],
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 1024, height: 1024 });
  await page.setDefaultNavigationTimeout(7000);
  await page.setDefaultTimeout(7000);
  await page.deleteCookie(...(await page.cookies()));
  await page.setCookie(...cleanedCookies);
  return { browser, page };
}

// Function to wait for the disappearance of an element
async function waitForElementToDisappear(page, selector) {
  const timeout = 3000; // 3 secs
  const start = Date.now();
  while (Date.now() - start < timeout) {
    const element = await page.$(selector);
    if (!element) {
      return true;
    }
    await new Promise((resolve) => setTimeout(resolve, 100)); // Wait for 100ms before checking again
  }
  throw new Error(`Element ${selector} did not disappear within ${timeout}ms`);
}

module.exports = { createPage, waitForElementToDisappear };
