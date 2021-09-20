import * as fs from "fs";
import * as path from "path";
import Result from "./src/Result.js";

function print(results, resultFile) {
    console.log(`Writing result to ${resultFile} ...`);
    let out = fs.createWriteStream(resultFile, {flags:'w'}); // Overwrites existing file
    out.write(Result.getCSVHeader() + "\n");
    for(let i = 0; i < results.length; i++) {
        out.write(results[i].toCSVLine() + "\n");
    }
    console.log(`Done.`)
}

function run(pathToDirectory, resultFile) {
    console.log(`Reading results from ${pathToDirectory} ...`);
    let files = fs.readdirSync(pathToDirectory),
        results = [];
    for (let i = 0; i < files.length; i++) {
        console.log(`Processing result set [${files[i]}] ...`);
        results.push(Result.fromFilePath(path.join(pathToDirectory, files[i])));
    }
    print(results, resultFile);
}

// Run script and use params from startup script (npm start) as data directory and result file
run(process.argv[2], process.argv[3]);