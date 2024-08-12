async function waitForElement(page, xpath, timeout = 5000) {
  const start = Date.now();

  while (Date.now() - start < timeout) {
    const elementHandle = await page.evaluateHandle((xpath) => {
      const result = document.evaluate(
        xpath,
        document,
        null,
        XPathResult.FIRST_ORDERED_NODE_TYPE,
        null
      ).singleNodeValue;
      return result || null;
    }, xpath);

    if (elementHandle && (await elementHandle.jsonValue()) !== null) {
      return elementHandle;
    }

    await new Promise((resolve) => setTimeout(resolve, 100)); // Polling interval of 100ms
  }

  console.error(`Element not found for xpath: ${xpath}`);
  return null;
}

async function waitForElementToDisappear(page, xpath, timeout = 5000) {
  const start = Date.now();

  while (Date.now() - start < timeout) {
    const elementExists = await page.evaluate((xpath) => {
      const result = document.evaluate(
        xpath,
        document,
        null,
        XPathResult.FIRST_ORDERED_NODE_TYPE,
        null
      ).singleNodeValue;
      return !!result;
    }, xpath);

    if (!elementExists) {
      return true;
    }

    await new Promise((resolve) => setTimeout(resolve, 100)); // Polling interval of 100ms
  }

  console.error(`Element did not disappear for xpath: ${xpath}`);
  return false;
}

module.exports = {
  waitForElement,
  waitForElementToDisappear,
};
