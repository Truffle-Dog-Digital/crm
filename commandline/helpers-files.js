const fs = require("fs");
const readline = require("readline");

// Return an array of non-blank lines from a text file
async function getArrayFromTextFile(filename) {
  const lines = [];
  const fileStream = fs.createReadStream(filename);
  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity,
  });

  for await (const line of rl) {
    const trimmedLine = line.trim();
    if (trimmedLine) {
      lines.push(trimmedLine);
    }
  }

  console.log(`${filename} .. total non-blank lines: ${lines.length}`);
  return lines;
}

// Return an array of humans from a JSONL file
// Checks for duplicate profileIds and includes everything except explicit duplicates
async function getArrayFromJsonl(filename) {
  const dataArray = [];
  const seenProfileIds = new Set();
  let totalLines = 0;
  let parseErrorFound = false;

  const fileStream = fs.createReadStream(filename);
  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity,
  });

  for await (const line of rl) {
    const trimmedLine = line.trim();
    if (trimmedLine) {
      totalLines++;
      try {
        const obj = JSON.parse(trimmedLine);
        const profileId = obj.profileId;

        if (profileId != null && seenProfileIds.has(profileId)) {
          // Skip this object because it has a duplicate profileId
          console.log(`Duplicate profile ID found:\n ${JSON.stringify(obj)}`);
          continue;
        }

        if (profileId != null) {
          seenProfileIds.add(profileId);
        }
        dataArray.push(obj);
      } catch (error) {
        console.log(`Error parsing line: ${line}`);
        parseErrorFound = true;
      }
    }
  }

  console.log(`${filename} .. total non-blank lines: ${totalLines}`);
  console.log(`${filename} .. total objects in array: ${dataArray.length}`);

  if (parseErrorFound) {
    return null;
  }

  return dataArray;
}

module.exports = {
  getArrayFromTextFile,
  getArrayFromJsonl,
};
