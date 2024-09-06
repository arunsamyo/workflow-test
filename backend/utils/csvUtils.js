const csv = require('csv-parser');
const { Readable } = require('stream');

// Parse CSV data to an array of objects
exports.parseCSV = (csvData) => {
  const results = [];
  const readable = Readable.from(csvData);
  readable.pipe(csv())
    .on('data', (row) => {
      results.push(row);
    });
  return results;
};

// Convert specified column to lowercase
exports.filterDataToLower = (data, column) => {
  return data.map((row) => {
    row[column] = row[column].toLowerCase();
    return row;
  });
};

// Convert data to JSON format
exports.convertToJson = (data) => {
  return JSON.stringify(data);
};
