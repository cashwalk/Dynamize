const { dynamize } = require('./dynamize');
const schema = require('../jest-dynamodb-config').tables[0];

test('findOne', async () => {
  dynamize.model('files', schema);
  const { Files: DB } = dynamize.models;

  await DB.put({ name: 'hello', date: '2019-10-01' });

  expect(await DB.findOne({ name: 'hello', date: '2019-10-01' })).toEqual({
    Item: { name: 'hello', date: '2019-10-01' },
  });

  await DB.delete({ name: 'hello', date: '2019-10-01' });
});
