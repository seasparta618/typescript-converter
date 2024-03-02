import { convertToObject } from './utils/typeConverter';
import * as fs from 'fs';

// get command line arguments
const args = process.argv.slice(2);
const inputFlagIndex = args.indexOf('--input-file');
const outputFlagIndex = args.indexOf('--output-file');

// check if the --input-file path is provided
if (inputFlagIndex === -1 || args.length < 2) {
  console.error('Usage: node index.js --input-file path [--output-file path]');
  process.exit(1);
}

const inputFilePath = args[inputFlagIndex + 1];
const outputFilePath =
  outputFlagIndex !== -1 ? args[outputFlagIndex + 1] : null;

// check if the input file exists
if (!fs.existsSync(inputFilePath)) {
  console.error(`Input file "${inputFilePath}" not found.`);
  process.exit(1);
}

const typeString = fs.readFileSync(inputFilePath, 'utf-8').trim();

// check if the input content
if (typeString === '') {
  console.error('Input content is empty.');
  process.exit(1);
}

const typeObject = convertToObject(typeString);

if (typeObject === null) {
  console.error('Invalid input: Unable to convert to a valid syntax tree.');
  process.exit(1);
}

// if the output file path is provided, write into the path, else, print in the console
if (outputFilePath) {
  fs.writeFileSync(outputFilePath, JSON.stringify(typeObject, null, 2));
  console.log(`Output written to "${outputFilePath}".`);
} else {
  console.log('Converted object:', JSON.stringify(typeObject, null, 2));
}
