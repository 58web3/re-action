const dynamoose = require('dynamoose');
const READ_THROUGHPUT = 20;
const WRITE_THROUGHPUT = 20;

let ddb = null;
if (process.env.USE_DYNAMODB_LOCAL === 'true') {
  ddb = new dynamoose.aws.ddb.DynamoDB({
    'region': process.env.DYNAMODB_REGION,
    'credentials': {accessKeyId: 'FAKE', secretAccessKey: 'FAKE'},
    'endpoint': process.env.DYNAMODB_LOCAL_URL,
  });
  dynamoose.aws.ddb.set(ddb);
} else {
  ddb = new dynamoose.aws.ddb.DynamoDB({
    'region': process.env.DYNAMODB_REGION,
  });
  dynamoose.aws.ddb.set(ddb);
}

// development: dev_, staging:stg_, production:設定しない
if (process.env.DYNAMODB_TABLE_PREFIX) {
  dynamoose.Table.defaults.set({
    'prefix': process.env.DYNAMODB_TABLE_PREFIX ?
        process.env.DYNAMODB_TABLE_PREFIX : '',
    'throughput': {
      'read': READ_THROUGHPUT,
      'write': WRITE_THROUGHPUT,
    },
  });
}

module.exports = dynamoose;
