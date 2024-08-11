const { waitForSelector } = require("puppeteer");

async function puppeteerGetNewProfileId(profileId, page) {
  const possibleRedirectSelectors = [
    `a[href*="/details/"]:not([href*="${profileId}/"])`,
    `a[href*="/overlay/"]:not([href*="${profileId}/"])`,
    `a[href*="/recent-activity/"]:not([href*="${profileId}/"])`,
  ];

  let newProfileId = null;

  for (const selector of possibleRedirectSelectors) {
    const redirectElement = await page.$(selector);
    if (redirectElement) {
      const href = await page.evaluate(
        (element) => element.href,
        redirectElement
      );
      const match = href.match(/\/in\/([^/]+)\//);
      if (match && match[1] !== profileId) {
        newProfileId = match[1];
        console.log(
          `==== ALERT: check master file for duplicates  (old:${profileId} new:${newProfileId}) ====`
        );
        break;
      }
    }
  }

  return newProfileId;
}

async function puppeteerGetRoles(page) {
  const roles = [];

  const currentRoles = await page.$$(
    'xpath///section[.//div[@id="experience"]]//span[contains(text(), " - Present")]/ancestor::*[2]'
  );

  for (const role of currentRoles) {
    const tagName = await role.evaluate((node) => node.tagName.toLowerCase());
    let position = null;
    let company = null;

    if (tagName === "div") {
      const spans = await role.$$('span[aria-hidden="true"]');
      if (spans.length >= 2) {
        position = await spans[0].evaluate((node) => node.textContent.trim());
        company = await spans[1].evaluate((node) => node.textContent.trim());
      }
    } else {
      const positionSpan = await role.$('span[aria-hidden="true"]');
      position = positionSpan
        ? await positionSpan.evaluate((node) => node.textContent.trim())
        : null;

      const ancestorLevel = await role.evaluateHandle((node) => {
        let current = node;
        for (let i = 0; i < 6; i++) {
          current = current.parentElement;
        }
        let sibling = current.previousElementSibling;
        return sibling;
      });

      if (ancestorLevel) {
        const companySpan = await ancestorLevel.$('span[aria-hidden="true"]');
        company = companySpan
          ? await companySpan.evaluate((node) => node.textContent.trim())
          : null;
      }
    }

    if (position) {
      position = position.split(" · ")[0];
    }

    roles.push({ company, position });
  }

  return roles;
}

module.exports = {
  puppeteerGetNewProfileId,
  puppeteerGetRoles,
};
