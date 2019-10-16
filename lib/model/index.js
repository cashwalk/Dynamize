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
    let nickname = name;

    if (name && (name.TableName || name.Schema || name.TableNickname)) {
      schema = name.Schema;
      nickname = name.TableNickname || name.nickname;
      name = name.TableName || name.name;
    }

    // FIXME: throw specific error
    if (!this instanceof Dynamize) throw new Error('You should use Dynamize instance');

    this.models[toPascalCase(nickname)] = generateHandler({ name, schema, document: this.document });
  };
};
