# Experiment Result Converter

This script transforms data from multiple JSON result files - gathered from a algorithm visualization experiment - into a single CSV file.

## Usage

1. Install dependencies: `npm install`
2. Copy all JSON files into `data` (create folder if not exists)
3. Run `npm start`

CSV data will be generated in `results.csv`.

## Known issues

- Free text answers are not handled properly resulting in shifted columns in generated CSV file.
- See `TODO` comments in code for possible improvments