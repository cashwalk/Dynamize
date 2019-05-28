'use strict';

const showTables = require('./showTables');

module.exports = async function modelMethodGenerator(Dynamize) {
  Dynamize.prototype.showTables = Dynamize.prototype.listTables = showTables(Dynamize);
};
