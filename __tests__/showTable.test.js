'use strict';

const AWS = require('aws-sdk');
const DynamoDbLocal = require('dynamodb-local');
const kill = require('kill-port');
const { Dynamize } = require('..');

const dynamoLocalPort = 9010;

const dynamize = new Dynamize({
  accessKeyId: 'access_key_id',
  secretAccessKey: 'secret_access_key',
  region: 'us-west-2',
  endpoint: new AWS.Endpoint(`http://localhost:${dynamoLocalPort}`),
});

test('should show tables ', async () => {
  const tables = await dynamize.showTables();

  expect(tables).toBeDefined();
  expect(Array.isArray(tables.TableNames)).toBeTruthy();
});
