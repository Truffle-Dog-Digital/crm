export async function waitForXPath(xpath, timeout = 3000) {
  return new Promise((resolve) => {
    const intervalTime = 100;
    let elapsedTime = 0;

    const interval = setInterval(() => {
      const results = [];
      const query = document.evaluate(
        xpath,
        document,
        null,
        XPathResult.ORDERED_NODE_SNAPSHOT_TYPE,
        null
      );
      for (let i = 0; i < query.snapshotLength; i++) {
        results.push(query.snapshotItem(i));
      }
      if (results.length > 0) {
        clearInterval(interval);
        resolve(results);
      } else if (elapsedTime >= timeout) {
        clearInterval(interval);
        resolve(null); // Return null if timeout is reached
      }
      elapsedTime += intervalTime;
    }, intervalTime);
  });
}

export function waitForXPathToDisappear(xpath, timeout = 3000) {
  return new Promise((resolve, reject) => {
    const intervalTime = 100;
    let elapsedTime = 0;

    const interval = setInterval(() => {
      const element = document.evaluate(
        xpath,
        document,
        null,
        XPathResult.FIRST_ORDERED_NODE_TYPE,
        null
      ).singleNodeValue;
      if (!element) {
        clearInterval(interval);
        resolve();
      } else if (elapsedTime >= timeout) {
        clearInterval(interval);
        reject(
          new Error(`Timeout: Element with XPath "${xpath}" did not disappear`)
        );
      }
      elapsedTime += intervalTime;
    }, intervalTime);
  });
}

export function waitForElement(selector, timeout = 3000) {
  return new Promise((resolve, reject) => {
    const intervalTime = 100;
    let elapsedTime = 0;

    const interval = setInterval(() => {
      const element = document.querySelector(selector);
      if (element) {
        clearInterval(interval);
        resolve(element);
      } else if (elapsedTime >= timeout) {
        clearInterval(interval);
        reject(
          new Error(
            `REABILITY: Timeout: Element ${selector} not found after ${timeout}ms`
          )
        );
      }
      elapsedTime += intervalTime;
    }, intervalTime);
  });
}

export function injectHTMLAndCSS(htmlPath, cssPath, injectInto) {
  return waitForElement(injectInto).then((injectTarget) => {
    return new Promise((resolve, reject) => {
      const fetchCSS = cssPath
        ? fetch(chrome.runtime.getURL(cssPath))
            .then((response) => response.text())
            .then((css) => {
              const style = document.createElement("style");
              style.textContent = css;
              document.head.appendChild(style);
            })
            .catch((error) => reject(error))
        : Promise.resolve();

      const fetchHTML = htmlPath
        ? fetch(chrome.runtime.getURL(htmlPath))
            .then((response) => response.text())
            .then((html) => {
              const tempDiv = document.createElement("div");
              tempDiv.innerHTML = html;
              while (tempDiv.firstChild) {
                injectTarget.appendChild(tempDiv.firstChild);
              }
              resolve();
            })
            .catch((error) => reject(error))
        : Promise.resolve();

      Promise.all([fetchCSS, fetchHTML]).then(resolve).catch(reject);
    });
  });
}
