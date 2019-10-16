const { dynamize } = require('../dynamize');
const schema = require('../../jest-dynamodb-config').tables[0];

test('find by eq and between operator', async () => {
  dynamize.model('files', schema);
  const { Files: DB } = dynamize.models;
  const name = 'hi';
  let date = '2019-10-03';
  await DB.put({ name, date });
  date = '2019-10-04';
  await DB.put({ name, date });
  date = '2019-10-05';
  await DB.put({ name, date });

  let result = await DB.find({ name: { eq: name }, date: { between: [ '2019-10-03', '2019-10-05'] } });
  expect(Array.isArray(result.Items)).toBeTruthy();
  let item = result.Items.find(value => value.date === date);
  expect(item).toEqual({ name, date })

  expect(result.Count).toEqual(3);

  await DB.delete({ name, date });
  date = '2019-10-04';
  await DB.delete({ name, date });
  date = '2019-10-03';
  await DB.delete({ name, date });
});
