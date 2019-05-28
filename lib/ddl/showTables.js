'use strict';

module.exports = function makeShowTableDDL(Dynamize) {
  return async function showTablesDDL(params = {}) {
    // FIXME: throw specific error
    if (!this instanceof Dynamize) throw new Error('You should use Dynamize instance');

    try {
      const result = await this.dynamodb.listTables(params).promise();
      return result;
    } catch (ce) {
      // FIXME: throw specific error
      throw new Error(ce);
    }
  };
};
