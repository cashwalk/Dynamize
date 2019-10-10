'use strict';

const opList = {
  eq: '=',
  gt: '>',
  gte: '>=',
  lt: '<',
  lte: '<=',
};

function getQueryParamsFromCondition(condition, option) {
  /**
   * condition = {
   *   key1: { eq: value1 },
   *   key2: { gt: value2 },
   * }
   */

  const result = {
    KeyConditionExpression: '',
    ExpressionAttributeValues: {},
    ExpressionAttributeNames: {},
  };

  Object.keys(condition).forEach((key) => {
    Object.keys(condition[key]).forEach((op) => {
      if (result.KeyConditionExpression) result.KeyConditionExpression += ' and ';
      result.KeyConditionExpression += `#${key} ${opList[op]} :${key}`;
      result.ExpressionAttributeValues[`:${key}`] = condition[key][op];
      result.ExpressionAttributeNames[`#${key}`] = key;
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

function getScanParamsFromCondition(condition, option) {
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

exports.generateHandler = function generateDynamoDBHandler({ name: TableName, schema, document }) {
  return {
    async create(Item) {
      try {
        await document.put({
          TableName,
          Item,
        }).promise();
      } catch (ce) {
        throw ce;
      }
    },

    async put(Item) {
      try {
        await document.put({
          TableName,
          Item,
        }).promise();
      } catch (ce) {
        throw ce;
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
        throw ce;
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
        throw ce;
      }
    },

    async find(condition, option) {
      const params = Object.assign(
        { TableName },
        getQueryParamsFromCondition(condition, option),
      );

      try {
        const data = await document.query(params).promise();
        return data;
      } catch (ce) {
        throw ce;
      }
    },

    async query(condition, option) {
      const params = Object.assign(
        { TableName },
        getQueryParamsFromCondition(condition, option),
      );

      try {
        const data = await document.query(params).promise();
        return data;
      } catch (ce) {
        throw ce;
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
        throw ce;
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
        throw ce;
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
        throw ce;
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
        throw ce;
      }
    },

    async delete(Key) {
      try {
        document.delete({
          TableName,
          Key,
        }).promise();
      } catch (ce) {
        throw ce;
      }
    },
  };
};
