import path from "path";
import { JSDOM } from "jsdom";

export async function render(filename) {
  const filePath = path.join(process.cwd(), filename);

  const dom = await JSDOM.fromFile(filePath, {
    runScripts: "dangerously",
    resources: "usable",
  });

  return dom;
}
