const { getArrayFromJsonl } = require("./helpers-files");

async function listKeysInMaster() {
  const humansMasterFile = "humansMaster.jsonl";

  // Load the humansMaster.jsonl into an array
  const humansMasterArray = await getArrayFromJsonl(humansMasterFile);

  if (!humansMasterArray) {
    console.error("Failed to load the humansMaster.jsonl file.");
    return;
  }

  // Create a set to store distinct keys
  const distinctKeys = new Set();

  // Iterate over each object in the array and add keys to the set
  humansMasterArray.forEach((human) => {
    Object.keys(human).forEach((key) => distinctKeys.add(key));
  });

  // Convert the set to an array and log the distinct keys
  distinctKeys.forEach((key) => console.log(key));
}

listKeysInMaster();
