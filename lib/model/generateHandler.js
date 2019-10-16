'use strict';

const opList = {
  eq: '=',
  gt: '>',
  gte: '>=',
  lt: '<',
  lte: '<=',
};

function getQueryParamsFromCondition(condition = {}, option = {}, keys = {}) {
  /**
   * condition = {
   *   key1: { eq: value1 },
   *   key2: { gt: value2 },
   *   key3: { between: [ value3, value4 ] },
   * }
   * 
   * option = {
   *   limit: 10,
   *   index: id-date-index
   * }
   * 
   * keys = {
   *   hashKey = [ key1, S ]
   *   rangeKey = [ date, S ]
   * }
   */

  const { hashKey = [], rangeKey = [] } = keys;

  const result = {
    KeyConditionExpression: '',
    ExpressionAttributeValues: {},
    ExpressionAttributeNames: {},
  };

  // check Hash Key
  let key = hashKey[0];

  if (!condition[key] || !condition[key].eq) throw new Error('Hash Key should be exist and should be \'eq\'');

  result.KeyConditionExpression += `#${key} = :${key}`;
  result.ExpressionAttributeValues[`:${key}`] = condition[key].eq;
  result.ExpressionAttributeNames[`#${key}`] = key;
  delete condition[key];

  Object.keys(condition).forEach((key) => {
    Object.keys(condition[key]).forEach((op) => {
      if (result.KeyConditionExpression) result.KeyConditionExpression += ' and ';

      switch(op) {
        case 'between':
          let values = condition[key].between;
          if (!values || values.length !== 2) throw new Error('between should have 2 values');
          result.KeyConditionExpression += `#${key} between :${key}1 and :${key}2`;
          result.ExpressionAttributeValues[`:${key}1`] = condition[key].between[0];
          result.ExpressionAttributeValues[`:${key}2`] = condition[key].between[1];
          result.ExpressionAttributeNames[`#${key}`] = key;
          break;
        default:
          result.KeyConditionExpression += `#${key} ${opList[op]} :${key}`;
          result.ExpressionAttributeValues[`:${key}`] = condition[key][op];
          result.ExpressionAttributeNames[`#${key}`] = key;
      }
    });
  });

  if (!option) return result;
  if (option.limit) result.Limit = option.limit;
  if (option.index) result.IndexName = option.index;
  if (option.fields && option.fields.length > 0) {
    let ProjectionExpression = '';
    option.fields.forEach((field) => {
      ProjectionExpression += `#${field},`;
      result.ExpressionAttributeNames[`#${field}`] = field;
    });
    ProjectionExpression = ProjectionExpression.slice(0, -1);
    result.ProjectionExpression = ProjectionExpression;
  }
  if (option.ScanIndexForward === false) result.ScanIndexForward = false;

  return result;
}

function getScanParamsFromCondition(condition, option, keys) {
  /**
   * condition = {
   *   key1: { eq: value1 },
   *   key2: { gt: value2 },
   * }
   */

  if (!condition) return;

  const result = {
    FilterExpression: '',
    ExpressionAttributeValues: {},
    ExpressionAttributeNames: {},
  };

  Object.keys(condition).forEach((key) => {
    Object.keys(condition[key]).forEach((op) => {
      result.FilterExpression += `#${key} ${op} :${key}`;
      result.ExpressionAttributeValues[`:${key}`] = condition[key][op];
      result.ExpressionAttributeNames[`#${key}`] = key;
    });
  });

  if (!option) return result;
  if (option.limit) result.Limit = option.limit;
  if (option.fields && option.fields.length > 0) {
    let ProjectionExpression = '';
    option.fields.forEach((field) => {
      ProjectionExpression += `#${field},`;
      result.ExpressionAttributeNames[`#${field}`] = field;
    });
    ProjectionExpression = ProjectionExpression.slice(0, -1);
    result.ProjectionExpression = ProjectionExpression;
  }

  return result;
}

exports.generateHandler = function generateDynamoDBHandler({ name, schema = {}, document }) {

  let hashKey = ['', '']; // name, type
  let rangeKey = ['', '']; // name, type

  if (schema.KeySchema) {
    if (schema.KeySchema.length > 1) {
      /**
       * hashKey = ['id', 'S']
       * rangeKey = ['date', 'S']
       */
      hashKey = [schema.KeySchema[0].AttributeName, schema.AttributeDefinitions[0].AttributeType]
      rangeKey = [schema.KeySchema[1].AttributeName, schema.AttributeDefinitions[1].AttributeType]
    } else {
      hashKey = [schema.KeySchema[0].AttributeName, schema.AttributeDefinitions[0].AttributeType]
    }
  } else {
    throw new Error('schema is required');
  }

  let TableName = name;
  if (schema.TableName) TableName = schema.TableName;

  return {
    async create(Item) {
      try {
        await document.put({
          TableName,
          Item,
        }).promise();
      } catch (ce) {
        throw new Error(ce);
      }
    },

    async put(Item) {
      try {
        await document.put({
          TableName,
          Item,
        }).promise();
      } catch (ce) {
        throw new Error(ce);
      }
    },

    async findOne(Key) {
      try {
        const data = await document.get({
          TableName,
          Key,
        }).promise();
        return data;
      } catch (ce) {
        throw new Error(ce);
      }
    },

    async get(Key) {
      try {
        const data = await document.get({
          TableName,
          Key,
        }).promise();
        return data;
      } catch (ce) {
        throw new Error(ce);
      }
    },

    async find(condition, option) {
      const params = Object.assign(
        { TableName },
        getQueryParamsFromCondition(condition, option, { hashKey, rangeKey }),
      );

      try {
        const data = await document.query(params).promise();
        return data;
      } catch (ce) {
        throw new Error(ce);
      }
    },

    async query(condition, option) {
      const params = Object.assign(
        { TableName },
        getQueryParamsFromCondition(condition, option, { hashKey, rangeKey }),
      );

      try {
        const data = await document.query(params).promise();
        return data;
      } catch (ce) {
        throw new Error(ce);
      }
    },

    async count(condition, option) {
      const params = Object.assign(
        { TableName },
        getQueryParamsFromCondition(condition, option),
      );

      try {
        const data = document.count(params).promise();
        return data;
      } catch (ce) {
        throw new Error(ce);
      }
    },

    async scan(condition, option) {
      const params = Object.assign(
        { TableName },
        getScanParamsFromCondition(condition, option),
      );

      try {
        return document.scan(params).promise();
      } catch (ce) {
        throw new Error(ce);
      }
    },

    async set(params) {
      const {
        Key,
        data,
      } = params;

      const updatedFields = Object.keys(data);
      const EAV = {};
      const EAN = {};
      let UE = 'set ';
      let update = false;

      updatedFields.forEach((uf) => {
        if (!data[uf] && data[uf] !== 0 && data[uf] !== false) return;

        UE += update ? `,#${uf}=:${uf}` : `#${uf}=:${uf}`;
        update = true;

        EAV[`:${uf}`] = data[uf];
        EAN[`#${uf}`] = uf;
      });

      try {
        await document.update({
          TableName,
          Key,
          UpdateExpression: UE,
          ExpressionAttributeValues: EAV,
          ExpressionAttributeNames: EAN,
        }).promise();
      } catch (ce) {
        throw new Error(ce);
      }
    },

    async setAndIncrease(params) {
      const {
        Key,
        data,
        increasingFields,
      } = params;
      const updatedFields = Object.keys(data);
      const EAV = {};
      const EAN = {};
      let UE = 'set ';
      let update = false;

      updatedFields.forEach((uf) => {
        if (!data[uf]) return;

        if (increasingFields && increasingFields.indexOf(uf) >= 0) UE += update ? `,#${uf}= #${uf} + :${uf}` : `#${uf}= #${uf} + :${uf}`;
        else UE += update ? `,#${uf}=:${uf}` : `#${uf}=:${uf}`;
        update = true;

        EAV[`:${uf}`] = data[uf];
        EAN[`#${uf}`] = uf;
      });

      try {
        await document.update({
          TableName,
          Key,
          UpdateExpression: UE,
          ExpressionAttributeValues: EAV,
          ExpressionAttributeNames: EAN,
        }).promise();
      } catch (ce) {
        throw new Error(ce);
      }
    },

    async delete(Key) {
      try {
        await document.delete({
          TableName,
          Key,
        }).promise();
      } catch (ce) {
        throw new Error(ce);
      }
    },
  };
};
