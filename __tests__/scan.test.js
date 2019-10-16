'use strict';

const { dynamize } = require('./dynamize');
const schema = require('../jest-dynamodb-config').tables[0];

test('scan should return values', async () => {
  dynamize.model('files', schema);
  const { Files: DB } = dynamize.models;

  const result = await DB.scan();

  expect(result).toBeDefined();
  expect(Array.isArray(result.Items)).toBeTruthy();
});
