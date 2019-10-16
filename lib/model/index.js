'use strict';

const { toPascalCase } = require('../util');
const { generateHandler } = require('./generateHandler');

module.exports = function modelMethodGenerator(Dynamize) {
  /*
  'Animal.Dog',
  {
    TableName: 'test.cw.catalog',
    KeySchema: [{ AttributeName: 'name', KeyType: 'HASH' }],
    AttributeDefinitions: [{ AttributeName: 'name', AttributeType: 'S' }],
    ProvisionedThroughput: { ReadCapacityUnits: 1, WriteCapacityUnits: 1 }
  },
  */
  Dynamize.prototype.model = function model(name, schema) {
    if (name && name.TableName && name.KeySchema) {
      schema = name;
      name = name.TableName;
    }

    // FIXME: throw specific error
    if (!this instanceof Dynamize) throw new Error('You should use Dynamize instance');

    this.models[toPascalCase(name)] = generateHandler({ name, schema, document: this.document });
  };
};
