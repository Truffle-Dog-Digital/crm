// these helpers not currently used, left in case I need them again soon

export function setLocalStorage(key, value) {
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

export function getLocalStorage(key) {
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
