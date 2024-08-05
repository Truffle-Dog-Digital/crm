const fs = require("fs");
const readline = require("readline");

async function readJsonlFile(filePath) {
  const data = {};
  const fileStream = fs.createReadStream(filePath);
  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity,
  });

  for await (const line of rl) {
    const trimmedLine = line.trim();
    if (trimmedLine) {
      const json = JSON.parse(trimmedLine);
      if (json.name) {
        data[json.name] = json;
      }
    }
  }
  return data;
}

async function processMasterFile() {
  const masterFile = "humansMaster.jsonl";
  const inputFile = "humansIn.jsonl";
  const outputFile = "humansOut.jsonl";
  const inputData = await readJsonlFile(inputFile);

  const fileStream = fs.createReadStream(masterFile);
  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity,
  });

  let entryBuffer = "";
  let processedLines = 0;
  let jsonConversionErrors = 0;
  let missingProfileIdNames = [];
  const outputLines = [];

  for await (const line of rl) {
    entryBuffer += line;

    try {
      const entry = JSON.parse(entryBuffer);
      processedLines++;

      if (!entry.profileId) {
        if (inputData[entry.name]) {
          entry.profileId = inputData[entry.name].profileId;
          missingProfileIdNames.push(`${entry.name} (found in lookup)`);
        } else {
          missingProfileIdNames.push(entry.name);
        }
      }

      outputLines.push(JSON.stringify(entry));
      entryBuffer = ""; // Clear buffer after successfully parsing a JSON entry
    } catch (e) {
      if (e instanceof SyntaxError) {
        // If JSON.parse throws a SyntaxError, it means the entry is not complete yet
        entryBuffer += "\n"; // Keep adding to the buffer
      } else {
        // If any other error occurs, log it and clear the buffer
        jsonConversionErrors++;
        console.error(`JSON conversion error: ${e.message}`);
        entryBuffer = ""; // Clear buffer to start fresh with the next line
      }
    }
  }

  fs.writeFileSync(outputFile, outputLines.join("\n"), "utf8");

  console.log(`Processed ${processedLines} entries from the master file.`);
  if (jsonConversionErrors > 0) {
    console.log(`Encountered ${jsonConversionErrors} JSON conversion errors.`);
  } else {
    console.log("No JSON conversion errors encountered.");
  }

  if (missingProfileIdNames.length > 0) {
    console.log(`Entries missing profileId (names):`);
    missingProfileIdNames.forEach((name) => console.log(name));
  } else {
    console.log("No entries are missing profileId.");
  }
}

processMasterFile();
