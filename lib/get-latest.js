const fs = require("fs");
const path = require("path");

function getLatestFile(folderPath) {
  const fileNames = fs.readdirSync(folderPath);

  const result = fileNames.reduce(
    (latestFile, name) => {
      const filePath = path.join(folderPath, name);
      const stat = fs.statSync(filePath);

      return stat.ctimeMs > latestFile.ctimeMs
        ? { path: filePath, ctimeMs: stat.ctimeMs }
        : latestFile;
    },
    { path: "", ctimeMs: 0 }
  );

  return result.path;
}

module.exports = getLatestFile;
