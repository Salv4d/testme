#!/usr/bin/env node

import { Runner } from "./runner.mjs";
// const Runner = require("./runner");
const runner = new Runner();

const run = async () => {
  await runner.collectFiles(process.cwd());
  runner.runTests();
};

run();
