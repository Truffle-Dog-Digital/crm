async function linkedinGrabProfileDetails(page) {
  try {
    // Just in case the page loads slowly, wait for the experience section
    await page.waitForSelector('xpath///section[.//div[@id="experience"]]');

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

    let roles = [];

    // Find "Current" position spans
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
        // Grab the position
        const positionSpan = await role.$('span[aria-hidden="true"]');
        position = positionSpan
          ? await positionSpan.evaluate((node) => node.textContent.trim())
          : null;

        // Navigate up 6 levels manually and then to the previous sibling
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

    return {
      name,
      linkedinDistance,
      roles,
    };
  } catch (error) {
    return false;
  }
}

module.exports = linkedinGrabProfileDetails;
