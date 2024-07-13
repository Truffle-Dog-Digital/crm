const fs = require("fs");
const path = require("path");
const ignore = require("ignore");

// Load ignore patterns from .gitignore
const ig = ignore();
if (fs.existsSync(".gitignore")) {
  ig.add(fs.readFileSync(".gitignore").toString());
}

// List of explicitly excluded files and patterns
const excludePatterns = [
  ".git",
  ".devcontainer",
  "node_modules",
  "package-lock.json",
  "package.json",
  ".eslintrc.cjs",
  ".gitignore",
  "*.example",
  "LICENSE*",
  "README*",
  "filetree.js",
];

// Function to check if a file matches any of the exclude patterns
function matchesExcludePattern(fileName) {
  return excludePatterns.some((pattern) => {
    if (pattern.includes("*")) {
      const regex = new RegExp(`^${pattern.replace("*", ".*")}$`);
      return regex.test(fileName);
    }
    return fileName === pattern;
  });
}

// Function to read directory structure
function readDir(dir, prefix = "") {
  const entries = fs.readdirSync(dir, { withFileTypes: true });

  return entries.reduce((acc, entry) => {
    const fullPath = path.join(dir, entry.name);
    const relativePath = path.relative(process.cwd(), fullPath);

    // Skip ignored paths and explicitly excluded files
    if (ig.ignores(relativePath) || matchesExcludePattern(entry.name)) {
      return acc;
    }

    if (entry.isDirectory()) {
      acc.push(`${prefix}${entry.name}/`);
      acc.push(...readDir(fullPath, `${prefix}  `));
    } else {
      acc.push(`${prefix}${entry.name}`);
    }

    return acc;
  }, []);
}

// Generate project structure
const structure = readDir(process.cwd());
fs.writeFileSync("filetree.txt", structure.join("\n"), "utf8");
