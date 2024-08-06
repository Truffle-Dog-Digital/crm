// ---------------------------------------
// Reorganize keys in humansMaster.jsonl
// -> output to humansOutSuccess.jsonl
// ---------------------------------------

const fs = require("fs");
const readline = require("readline");

async function readJsonlFile(filePath) {
  const data = [];
  const fileStream = fs.createReadStream(filePath);
  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity,
  });

  for await (const line of rl) {
    const trimmedLine = line.trim();
    if (trimmedLine) {
      const json = JSON.parse(trimmedLine);
      data.push(json);
    }
  }

  return data;
}

function reorderKeys(obj) {
  const orderedKeys = [
    "name",
    "profileId",
    "requestSent",
    "roles",
    "notes",
    "customText",
  ];
  const newObj = {};

  orderedKeys.forEach((key) => {
    if (obj.hasOwnProperty(key)) {
      newObj[key] = obj[key];
    }
  });

  Object.keys(obj).forEach((key) => {
    if (!newObj.hasOwnProperty(key)) {
      newObj[key] = obj[key];
    }
  });

  return newObj;
}

async function processAndReorder() {
  const masterFile = "humansMaster.jsonl";
  const outputFile = "humansOutSuccess.jsonl";

  const data = await readJsonlFile(masterFile);

  const reorderedData = data.map(reorderKeys);
  reorderedData.sort((a, b) => (a.name || "").localeCompare(b.name || ""));

  const outputLines = reorderedData.map((item) => JSON.stringify(item));

  fs.writeFileSync(outputFile, outputLines.join("\n"), "utf8");

  console.log(
    `Reorganized and sorted ${reorderedData.length} records by name and output to ${outputFile}.`
  );
}

processAndReorder();
