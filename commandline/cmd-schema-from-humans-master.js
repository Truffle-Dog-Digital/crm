const fs = require("fs/promises");

async function analyzeSchema() {
  // Read and parse the file
  const fileContent = await fs.readFile("humansMaster.jsonl", {
    encoding: "utf8",
  });

  // Split the content into lines and parse each JSON object
  const lines = fileContent.split("\n").filter((line) => line.trim());
  const records = lines.map((line) => {
    try {
      return JSON.parse(line);
    } catch (e) {
      console.log("Failed to parse line:", line);
      return null;
    }
  });

  // Function to get the type of a value
  function getValueType(value) {
    if (Array.isArray(value)) {
      if (value.length === 0) return "array(empty)";
      const elementType =
        typeof value[0] === "object" ? "object[]" : `array(${typeof value[0]})`;
      return elementType;
    }
    return typeof value;
  }

  // Collect all unique fields and their types
  const schema = new Map();

  records.forEach((record) => {
    if (!record) return;

    Object.entries(record).forEach(([key, value]) => {
      const valueType = getValueType(value);

      if (!schema.has(key)) {
        schema.set(key, new Set([valueType]));
      } else {
        schema.get(key).add(valueType);
      }
    });
  });

  // Convert schema to a more readable format
  const schemaDescription = {};
  schema.forEach((types, field) => {
    schemaDescription[field] = Array.from(types);
  });

  console.log("Schema structure:");
  console.log(JSON.stringify(schemaDescription, null, 2));

  // Additional analysis for nested structures
  const rolesAnalysis = new Set();
  records.forEach((record) => {
    if (record?.roles) {
      record.roles.forEach((role) => {
        Object.keys(role).forEach((key) => {
          rolesAnalysis.add(key);
        });
      });
    }
  });

  console.log("\nRoles object structure:");
  console.log(Array.from(rolesAnalysis));
}

// Call the async function
analyzeSchema().catch(console.error);
