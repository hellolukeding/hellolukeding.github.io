module.exports = () => {
  const fs = require("fs");
  const path = require("path");
  const directoryPath = path.join(process.cwd(), "/public/md");

  try {
    const folds = fs.readdirSync(directoryPath);
    const obj = {};
    folds.forEach((item) => {
      const filePath = path.join(directoryPath, item);
      if (fs.statSync(filePath).isDirectory()) {
        const files = fs
          .readdirSync(filePath)
          .filter((itm) => itm.includes(".md"))
          .map((file) => file.replace(".md", ""));
        obj[item] = files;
      }
    });
    return obj;
  } catch (error) {
    throw new Error(error);
  }
};
