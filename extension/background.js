chrome.runtime.onInstalled.addListener(() => {
  console.log("Extension installed");
});

chrome.runtime.onMessage.addListener(
  (scriptRequest, scriptSender, scriptResponse) => {
    console.log("Received script message", scriptRequest);
    if (scriptRequest.action === "callLemListBatch") {
      callLemlistBatch(scriptRequest, scriptResponse);
      // Return true to indicate we will send a response asynchronously
      return true;
    }
  }
);

const callLemlistBatch = async (scriptRequest, scriptResponse) => {
  const apiKey = scriptRequest.api_key;
  const apiUrl = new URL(scriptRequest.url);
  apiUrl.searchParams.append("access_token", apiKey);
  console.log("Fetch URL", apiUrl.toString());

  const options = {
    method: scriptRequest.method,
    headers: {
      "Content-Type": "application/json",
    },
  };

  let successCount = 0;
  let errorCount = 0;

  for (const linkedinUrl of scriptRequest.urls) {
    console.log(`Calling lemlist with: ${JSON.stringify({ linkedinUrl })}`);

    try {
      const lemlistResponse = await fetch(apiUrl.toString(), {
        ...options,
        body: JSON.stringify({ linkedinUrl }),
      });

      const lemlistData = await lemlistResponse.text();
      console.log("Lemlist response received:", lemlistData);

      if (lemlistResponse.ok) {
        successCount++;
        console.log("Lemlist response.ok");
      } else {
        errorCount++;
        console.log("Lemlist !response.ok:", lemlistData);
      }
    } catch (error) {
      errorCount++;
      console.error("Lemlist comms error:", error.message);
    }
  }

  const message = `${successCount} leads created in Lemlist, ${errorCount} errors occurred`;
  scriptResponse({ message });
};
