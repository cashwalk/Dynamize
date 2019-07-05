'use strict';

const { connect } = require('./connect');

function Dynamize(params = {}) {
  const {
    dynamodb,
    document,
  } = connect({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_DEFAULT_REGION,
    ...params,
  });
  this.dynamodb = dynamodb;
  this.document = document;

  this.models = {};
}

require('./model')(Dynamize);
require('./ddl')(Dynamize);

module.exports = { Dynamize };
