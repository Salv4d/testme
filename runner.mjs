// const fs = require("fs");
// const path = require("path");

import fs from "fs";
import path from "path";
import chalk from "chalk";
const { render } = await import("./render.js");

const ignoredDirs = ["node_modules", ".git"];

export class Runner {
  constructor() {
    this.testFiles = [];
  }

  async runTests() {
    for (let file of this.testFiles) {
      console.log(chalk.gray(`___________ ${file.shortName}`));
      const beforeEaches = [];

      globalThis.render = render;
      globalThis.beforeEach = (fn) => {
        beforeEaches.push(fn);
      };

      globalThis.it = (desc, fn) => {
        beforeEaches.forEach((func) => func());

        try {
          fn();
          console.log(chalk.green(`\t✓ Passed - ${desc}`));
        } catch (err) {
          const message = err.message.replace(/\n/g, "\n\t\t");
          console.log(chalk.red(`\t✗ Failed - ${desc}`));
          console.log(chalk.red(`\t >>>> ${message}`));
        }
      };

      try {
        import(file.name);
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
        this.testFiles.push({ name: filePath, shortName: file });
      } else if (stats.isDirectory() && !ignoredDirs.includes(file)) {
        const childFiles = await fs.promises.readdir(filePath);

        files.push(...childFiles.map((f) => path.join(file, f)));
      }
    }
  }
}

// module.exports = Runner;
