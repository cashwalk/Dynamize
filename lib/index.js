'use strict';

const { connect } = require('./connect');

function Dynamize(params) {
  if (!params) params = {};
  const region = params.region || process.env.AWS_DEFAULT_REGION;
  const accessKeyId = params.accessKeyId || process.env.AWS_ACCESS_KEY_ID;
  const secretAccessKey = params.secretAccessKey || process.env.AWS_SECRET_ACCESS_KEY;

  const {
    dynamodb,
    document,
  } = connect({
    region,
    accessKeyId,
    secretAccessKey,
  });
  this.dynamodb = dynamodb;
  this.document = document;

  this.models = {};
}

require('./model')(Dynamize);

module.exports = { Dynamize };