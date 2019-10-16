
let schema = {
  TableName: 'files',
  KeySchema: [
    { AttributeName: 'name', KeyType: 'HASH' },
    { AttributeName: 'date', KeyType: 'RANGE' },
  ],
  AttributeDefinitions: [
    { AttributeName: 'name', AttributeType: 'S' },
    { AttributeName: 'date', AttributeType: 'S' },
  ],
  ProvisionedThroughput: { ReadCapacityUnits: 1, WriteCapacityUnits: 1 },
};

module.exports = {
  tables: [ schema ],
  port: 9010,
};