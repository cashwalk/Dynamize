'use strict';

const AWS = require('aws-sdk');
const { dynamize } = require('./dynamize');

const dynamoLocalPort = 9010;

test('should show tables ', async () => {
  const tables = await dynamize.showTables();

  expect(tables).toBeDefined();
  expect(Array.isArray(tables.TableNames)).toBeTruthy();
  expect(tables.TableNames[0]).toEqual('files')
});
