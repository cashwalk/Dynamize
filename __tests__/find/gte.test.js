const { dynamize } = require('../dynamize');
const schema = require('../../jest-dynamodb-config').tables[0];

test('find by eq and gte operator', async () => {
  dynamize.model('files', schema);
  const { Files: DB } = dynamize.models;
  const name = 'hi';
  const date = '2019-10-03';

  await DB.put({ name, date });

  let result = await DB.find({ name: { eq: name }, date: { gte: date } });
  expect(Array.isArray(result.Items)).toBeTruthy();
  let item = result.Items.find(value => value.date === date);
  expect(item).toEqual({ name, date })

  await DB.delete({ name, date });
});
