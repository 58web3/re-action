const fs = require('fs');
const initDynamoose = require('../src/init_dynamoose');
global.dynamoose = initDynamoose.dynamoose;

async function loadData(schemaPath, modelName, recordsPath) {
  const schema = require(schemaPath);
  const model = dynamoose.model(modelName, schema);
  const records = await readJsonFile(recordsPath);

  for (const record of records) {
    const newRecord = new model(record);
    await newRecord.save();
  }
  console.log(`Loaded ${records.length} records to ${modelName} table`);
}

function readJsonFile(filePath) {
  return new Promise((resolve, reject) => {
    fs.readFile(filePath, 'utf8', (err, data) => {
      if (err) {
        reject(err);
      } else {
        resolve(JSON.parse(data));
      }
    });
  });
}

async function loadInitData() {
  // Donor Table
  loadData('../src/schemas/donor', 'Donor', './load_data/donor.json');

  // Token Table
  loadData('../src/schemas/token', 'Token', './load_data/token.json');

}

module.exports = {
  loadInitData
}