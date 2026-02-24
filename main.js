"use strict";

const fs = require("fs");
const { Command } = require("commander");

const program = new Command();

program
  .name("backend-course-2025-3")
  .description("Lab 3: Node.js built-in modules + npm modules (Commander.js)")
  .option("-i, --input <path>", "path to input JSON file")
  .option("-o, --output <path>", "path to output file")
  .option("-d, --display", "display result in console")
  // Option 7:
  .option("-h, --humidity", "display Humidity3pm field")
  .option("-r, --rainfall <number>", "filter by Rainfall > number", (v) =>
    Number(v),
  );

program.parse(process.argv);

const options = program.opts();

if (!options.input) {
  console.error("Please, specify input file");
  process.exit(1);
}

if (!fs.existsSync(options.input)) {
  console.error("Cannot find input file");
  process.exit(1);
}

let raw;
try {
  raw = fs.readFileSync(options.input, "utf-8");
} catch (e) {
  console.error("Cannot find input file");
  process.exit(1);
}

let data;
try {
  data = JSON.parse(raw);
} catch (e) {
  process.exit(1);
}

if (!Array.isArray(data)) {
  data = [];
}

const rainfallThreshold = Number.isFinite(options.rainfall)
  ? options.rainfall
  : null;

const lines = [];
for (const item of data) {
  if (item === null || typeof item !== "object") continue;

  const rainfall = Number(item.Rainfall);
  const pressure3pm = Number(item.Pressure3pm);

  if (!Number.isFinite(rainfall) || !Number.isFinite(pressure3pm)) continue;

  if (rainfallThreshold !== null && !(rainfall > rainfallThreshold)) continue;

  if (options.humidity) {
    const humidity3pm = Number(item.Humidity3pm);
    if (!Number.isFinite(humidity3pm)) continue;
    lines.push(`${rainfall} ${pressure3pm} ${humidity3pm}`);
  } else {
    lines.push(`${rainfall} ${pressure3pm}`);
  }
}

const result = lines.join("\n");

const shouldWriteFile =
  typeof options.output === "string" && options.output.length > 0;
const shouldDisplay = options.display === true;

if (shouldWriteFile) {
  fs.writeFileSync(options.output, result, "utf-8");
}

if (shouldDisplay) {
  if (result.length > 0) {
    console.log(result);
  } else {
    console.log("No data to display");
  }
}
