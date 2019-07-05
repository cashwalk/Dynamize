'use strict';

const { toPascalCase } = require('../util');
const { generateHandler } = require('./generateHandler');

module.exports = function modelMethodGenerator(Dynamize) {
  /*
  'Animal.Dog',
  {
    name: { type: String, primaryKey: true },
    gender: { type: String, sortKey: true, enum: ['m', 'f'] },
  },
  */
  Dynamize.prototype.model = function model(name, schema) {
    let nickname = name;

    if (name && (name.TableName || name.Schema || name.TableNickname || name)) {
      schema = name.Schema;
      nickname = name.TableNickname || name.nickname;
      name = name.TableName || name.name;
    }

    // FIXME: throw specific error
    if (!this instanceof Dynamize) throw new Error('You should use Dynamize instance');

    this.models[toPascalCase(nickname)] = generateHandler({ name, schema, document: this.document });
  };
};
