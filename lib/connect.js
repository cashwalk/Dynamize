'use strict';

const AWS = require('aws-sdk');
const https = require('https');

exports.connect = function connect(params) {
  console.log(1, params);
  const {
    region,
    accessKeyId,
    secretAccessKey,
  } = params;


  const agent = new https.Agent({
    maxSocket: 256,
    keepAlive: true,
    rejectUnauthorized: true,
  });

  const dynamodb = new AWS.DynamoDB({
    region,
    httpOptions: { agent },
    accessKeyId,
    secretAccessKey,
  });
  const document = new AWS.DynamoDB.DocumentClient({ service: dynamodb });

  return {
    dynamodb,
    document,
  };
};
