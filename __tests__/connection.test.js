const AWS = require('aws-sdk');
const DynamoDbLocal = require('dynamodb-local');
const kill = require('kill-port');
const { Dynamize } = require('../');

const dynamoLocalPort = 9010;

const dynamize = new Dynamize({
  accessKeyId: 'access_key_id',
  secretAccessKey: 'secret_access_key',
  region: 'us-west-2',
  endpoint: new AWS.Endpoint(`http://localhost:${dynamoLocalPort}`),
});

beforeAll(async () => {
  await kill(dynamoLocalPort);
  await DynamoDbLocal.launch(dynamoLocalPort, null, [], true);

  await dynamize.dynamodb.createTable({
    TableName: 'test.cw.catalog',
    KeySchema: [{ AttributeName: 'name', KeyType: 'HASH' }],
    AttributeDefinitions: [{ AttributeName: 'name', AttributeType: 'S' }],
    ProvisionedThroughput: { ReadCapacityUnits: 1, WriteCapacityUnits: 1 },
  }).promise();
});

afterAll(async () => {
  DynamoDbLocal.stop(dynamoLocalPort);
});

test('scan should return values', async () => {
  dynamize.model('test.cw.catalog');

  const { TestCwCatalog: DB } = dynamize.models;

  expect(await DB.scan()).toEqual({
    Items: [],
    Count: 0,
    ScannedCount: 0,
  })

  await DB.put({ name: 'hello' });

  expect(await DB.scan()).toEqual({
    Items: [
      { name: 'hello' },
    ],
    Count: 1,
    ScannedCount: 1,
  });
});
