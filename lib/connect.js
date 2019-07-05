'use strict';

const AWS = require('aws-sdk');
const https = require('https');

exports.connect = function connect(params = {}) {
  const {
    region,
    accessKeyId,
    secretAccessKey,
    ...other
  } = params;

  const dynamodb = new AWS.DynamoDB({
    region,
    accessKeyId,
    secretAccessKey,
    ...other,
  });

  const document = new AWS.DynamoDB.DocumentClient({ service: dynamodb });

  return {
    dynamodb,
    document,
  };
};
