# Document for Usage Guide
Dynamize is a promise-based Node.js ORM for DynamoDB inspired by Sequelize. You can manage most features in DynamoDB with Dynamize.

## What is DynamoDB?
> Amazon DynamoDB is a key-value and document database that delivers single-digit millisecond performance at any scale.

[Related Paper](http://www.read.seas.harvard.edu/~kohler/class/cs239-w08/decandia07dynamo.pdf)

## Example Code for Dynamize
[Example Repository](https://github.com/shoveling-pig/dynamize-example)

## Define Dynamize
`aws.js`

```js
'use strict';

const AWS = require('aws-sdk');
const https = require('https');
const { Dynamize } = require('dynamize');

const agent = new https.Agent({
  maxSocket: 256,
  keepAlive: true,
  rejectUnauthorized: true,
});

const dynamize = new Dynamize({
  region: 'YourAWSRegion',
  httpOptions: { agent },
  accessKeyId: 'YourAWSAccessKeyId',
  secretAccessKey: 'YourAWSSecretAccessKey',
});

const ddb = new AWS.DynamoDB();
const doc = new AWS.DynamoDB.DocumentClient();

exports.dynamize = dynamize;
exports.ddb = ddb;
exports.docClient = doc;
```

## Define Table
(TBD)

## Basic Operations
(TBD)

## Transaction
(TBD)

## Composite Key Delimiter Parser
(TBD)
