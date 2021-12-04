const fs = require("fs");
const path = require("path");

class Runner {
  constructor() {
    this.testFiles = [];
  }

  async collectFiles(targetPath) {
    const files = await fs.promises.readdir(targetPath);

    for (let file of files) {
      const filePath = path.join(targetPath, file);
      const stats = await fs.promises.lstat(filePath);

      if (stats.isFile() && file.includes(".test.js")) {
        this.testFiles.push({ name: filePath });
      } else if (stats.isDirectory()) {
        const childFiles = await fs.promises.readdir(filePath);

        files.push(...childFiles.map((f) => path.join(file, f)));
      }
    }
  }
}

module.exports = Runner;
