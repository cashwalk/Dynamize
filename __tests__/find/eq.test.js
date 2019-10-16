const { dynamize } = require('../dynamize');
const schema = require('../../jest-dynamodb-config').tables[0];

test('find by eq operator', async () => {
  dynamize.model('files', schema);
  const { Files: DB } = dynamize.models;

  await DB.put({ name: 'hello', date: '2019-10-02' });

  let result = await DB.find({ name: { eq: 'hello' } });
  expect(Array.isArray(result.Items)).toBeTruthy();
  let item = result.Items.find(value => value.date === '2019-10-02');
  expect(item).toEqual({ name: 'hello', date: '2019-10-02' })

//   result = await DB.find({ eq: 'hello', gte: '2019-10-02' });
//   console.log(result);

//   await DB.delete({ name: 'hello', date: '2019-10-02' });
});
