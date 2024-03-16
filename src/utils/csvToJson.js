const fs = require('fs');
const csvParser = require('csv-parser');

const csvToJson = async (csvFile) => {
  try {
    const jsonData = [];

    await new Promise((resolve, reject) => {
      fs.createReadStream(csvFile)
        .pipe(csvParser())
        .on('data', (row) => {
          jsonData.push(row);
        })
        .on('end', () => {
          resolve();
        })
        .on('error', (error) => {
          reject(error);
        });
    });

    return jsonData;

  } catch (error) {
    return console.error(error.message)
  }
}

module.exports = { csvToJson }