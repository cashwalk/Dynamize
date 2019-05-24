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
    // TODO: use specific error
    if (!this instanceof Dynamize) throw new Error('You should use Dynamize instance');

    this.models[toPascalCase(name)] = generateHandler({ name, schema, document: this.document });
  };
};
