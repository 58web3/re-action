const fs = require('fs');
const initDynamoose = require('../src/init_dynamoose');
global.dynamoose = initDynamoose.dynamoose;
const { setTimeout } = require('timers/promises');

async function createTable(schemaPath, modelName) {
  console.log(`Create Table ${modelName} start`)
  const schema = require(schemaPath);
  const model = dynamoose.model(modelName, schema);
  
  await new dynamoose.Table(modelName, [model]);

  console.log(`Create Table ${modelName} end`)
}

async function createAllTables() {
  // Donor
  await createTable('../src/schemas/donor', 'Donor');
  await setTimeout(500);

  // Token
  await createTable('../src/schemas/token', 'Token');
  await setTimeout(500);
  
}

module.exports = {
  createAllTables
}