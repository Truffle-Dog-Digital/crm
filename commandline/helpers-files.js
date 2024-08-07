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

  console.log(`${filename} ..     total non-blank lines: ${lines.length}`);
  return lines;
}

// Return a map of humans from jsonl file
// .. after doing duplicate checks and parsing json
// .. return null if any of those fail
async function getMapFromJsonl(filename) {
  const dataMap = new Map();
  let totalLines = 0;
  let duplicateFound = false;
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
        const key = `${obj.name || ""}-${obj.profileId}`;

        if (dataMap.has(key)) {
          console.log(`Duplicate profile ID found: ${obj.profileId}`);
          duplicateFound = true;
        } else {
          dataMap.set(key, obj);
        }
      } catch (error) {
        console.log(`Error parsing line: ${line}`);
        parseErrorFound = true;
      }
    }
  }

  console.log(`${filename} .. total non-blank lines: ${totalLines}`);
  console.log(`${filename} .. total objects processed: ${dataMap.size}`);

  if (parseErrorFound || duplicateFound) {
    return null;
  }

  return dataMap;
}

// Return an array of humans from jsonl file
async function getArrayFromJsonl(filename) {
  const dataMap = await getMapFromJsonl(filename);
  if (!dataMap) {
    return null;
  }

  return Array.from(dataMap.values());
}

module.exports = {
  getArrayFromTextFile,
  getMapFromJsonl,
  getArrayFromJsonl,
};
