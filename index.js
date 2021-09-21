import * as fs from "fs";
import * as path from "path";
import Result from "./src/Result.js";

// Read options from cli arguments
var options = {
    inputDir: process.argv[2],
    outputFile: process.argv[3],
    delimiter: process.argv[4]
};

/**
 * Read all experiment data from individual JSON files and returns array of flattened Result objects
 */
async function loadExperimentData() {
    console.log(`Reading results from ${options.inputDir} ...`);
    let files = await fs.promises.readdir(options.inputDir),
        results = [];
    for (let i = 0; i < files.length; i++) {
        console.log(`Processing result set [${files[i]}] ...`);
        let result = await Result.fromFilePath(path.join(options.inputDir, files[i]));
        results.push(result);
    }
    return results;
}

/**
 * Write all Result objects from results to single CSV file
 */
function writeResultsToFile(results) {
    console.log(`Writing result to ${options.outputFile} ...`);
    Result.setDelimiter(options.delimiter);
    let out = fs.createWriteStream(options.outputFile, {flags:'w'}); // Overwrites existing file
    out.write(Result.getCSVHeader() + "\n");
    for(let i = 0; i < results.length; i++) {
        out.write(results[i].toCSVLine() + "\n");
    }
    console.log(`Done.`)
}

// Load data and write CSV output
loadExperimentData().then(writeResultsToFile);