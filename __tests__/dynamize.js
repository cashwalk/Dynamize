'use strict';
const AWS = require('aws-sdk');
const { Dynamize } = require('..');

const dynamoLocalPort = 9010;
const dynamize = new Dynamize({
  accessKeyId: 'access_key_id',
  secretAccessKey: 'secret_access_key',
  sslEnabled: false,
  region: 'local-env',
  endpoint: new AWS.Endpoint(`http://localhost:${dynamoLocalPort}`),
});

exports.dynamize = dynamize;
