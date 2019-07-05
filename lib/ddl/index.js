'use strict';

const showTables = require('./showTables');

module.exports = async function ddlGenerator(Dynamize) {
  Dynamize.prototype.showTables = Dynamize.prototype.listTables = showTables(Dynamize);
};
