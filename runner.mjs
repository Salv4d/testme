// const fs = require("fs");
// const path = require("path");

import fs from "fs";
import path from "path";
import chalk from "chalk";

export class Runner {
  constructor() {
    this.testFiles = [];
  }

  async runTests() {
    for (let file of this.testFiles) {
      console.log(chalk.gray(`___________ ${file.name}`));
      const beforeEaches = [];

      globalThis.beforeEach = (fn) => {
        beforeEaches.push(fn);
      };

      globalThis.it = (desc, fn) => {
        beforeEaches.forEach((func) => func());

        try {
          fn();
          console.log(chalk.green(`Passed - ${desc}`));
        } catch (err) {
          console.log(chalk.red(`Failed - ${desc}`));
          console.log(chalk.red(`\t >>>> ${err.message}`));
        }
      };

      try {
        import(file.name);
        // require(file.name);
      } catch (err) {
        console.log(chalk.red(`Failed - Error loading file ${file.name}`));
        console.log(`\t >>>> ${err}`);
      }
    }
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

// module.exports = Runner;