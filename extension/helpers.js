function setLocalStorage(key, value) {
  try {
    const result = new Promise((resolve, reject) => {
      chrome.storage.local.set({ [key]: value }, () => {
        if (chrome.runtime.lastError) {
          reject(chrome.runtime.lastError);
        } else {
          resolve();
        }
      });
    });

    Promise.race([
      result,
      new Promise(
        (_, reject) => setTimeout(() => reject(new Error("Timeout")), 5000) // 5 seconds timeout
      ),
    ]);

    console.log(`REABILITY: ${key} saved successfully.`);
  } catch (error) {
    if (error.message === "Timeout") {
      console.error(`REABILITY: Error saving ${key}: Timeout after 5 seconds`);
    } else {
      console.error(`REABILITY: Error saving ${key}:`, error);
    }
  }
}

function getLocalStorage(key) {
  try {
    const result = new Promise((resolve, reject) => {
      chrome.storage.local.get([key], (data) => {
        if (chrome.runtime.lastError) {
          reject(chrome.runtime.lastError);
        } else {
          resolve(data[key] || null); // Resolve with null if key is not found
        }
      });
    });

    const value = Promise.race([
      result,
      new Promise(
        (_, reject) => setTimeout(() => reject(new Error("Timeout")), 5000) // 5 seconds timeout
      ),
    ]);

    return value;
  } catch (error) {
    if (error.message === "Timeout") {
      console.error(
        `REABILITY: Error retrieving ${key}: Timeout after 5 seconds`
      );
    } else {
      console.error(`REABILITY: Error retrieving ${key}:`, error);
    }
    return null;
  }
}

function waitForElement(selector, timeout = 3000) {
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

function injectHTMLAndCSS(htmlPath, cssPath, injectInto) {
  return waitForElement(injectInto).then((injectTarget) => {
    return new Promise((resolve, reject) => {
      // Fetch and inject CSS
      fetch(chrome.runtime.getURL(cssPath))
        .then((response) => response.text())
        .then((css) => {
          const style = document.createElement("style");
          style.textContent = css;
          document.head.appendChild(style);
        })
        .catch((error) => reject(error));

      // Fetch and inject HTML
      fetch(chrome.runtime.getURL(htmlPath))
        .then((response) => response.text())
        .then((html) => {
          const tempDiv = document.createElement("div");
          tempDiv.innerHTML = html;
          while (tempDiv.firstChild) {
            injectTarget.appendChild(tempDiv.firstChild);
          }
          resolve();
        })
        .catch((error) => reject(error));
    });
  });
}
