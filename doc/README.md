# Document for Usage Guide

## What is Dynamize?
> Dynamize is a promise-based Node.js ORM for DynamoDB inspired by Sequelize. You can manage most features in DynamoDB with Dynamize.

## What is DynamoDB?
> Amazon DynamoDB is a key-value and document database that delivers single-digit millisecond performance at any scale.

[Official Paper](http://www.read.seas.harvard.edu/~kohler/class/cs239-w08/decandia07dynamo.pdf)

## Example Code
[Example Repository](https://github.com/shoveling-pig/dynamize-example)

## Exmaple Directory Structure
```bash
├─app
│  ├─childProcess
│  ├─components
│  │  └─v1
│  │      └─event
│  │          ├─controller       
│  │          ├─model
│  │          │  └─dynamodb      
│  │          ├─route
│  │          └─service
│  ├─models
│  │  └─dynamodb
│  │      └─schema
│  └─routes
├─libs
```

## Initiate Dynamize
This code is in the `/libs/aws.js` file.

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

AWS.config.update({
  region: process.env.AWSRegion,
  httpOptions: { agent },
  accessKeyId: process.env.AWSAccessKeyId,
  secretAccessKey: process.env.AWSSecretAccessKey,
});

const ddb = new AWS.DynamoDB();
const docClient = new AWS.DynamoDB.DocumentClient();

const dynamize = new Dynamize({
  region: process.env.AWSRegion,
  httpOptions: { agent },
  accessKeyId: process.env.AWSAccessKeyId,
  secretAccessKey: process.env.AWSSecretAccessKey,
});

exports.dynamize = dynamize;
exports.ddb = ddb;
exports.docClient = docClient;
```

## Define Table Schemas
This code is in the `/app/models/dynamodb/schema/EventLogs.js` file.
```js
'use strict';

const { ddb } = require('../../../../libs/aws');

const params = {
  TableName: 'event_logs',
  KeySchema: [
    { AttributeName: 'eventId', KeyType: 'HASH' },
    { AttributeName: 'userId', KeyType: 'RANGE' },
  ],
  AttributeDefinitions: [
    { AttributeName: 'eventId', AttributeType: 'S' },
    { AttributeName: 'userId', AttributeType: 'S' },
    { AttributeName: 'date', AttributeType: 'S' },
  ],
  ProvisionedThroughput: {
    ReadCapacityUnits: 1,
    WriteCapacityUnits: 1,
  },
  LocalSecondaryIndexes: [
    {
      IndexName: 'eventId-date-index',
      KeySchema: [
        { AttributeName: 'eventId', KeyType: 'HASH' },
        { AttributeName: 'date', KeyType: 'RANGE' },
      ],
      Projection: {
        ProjectionType: 'ALL',
      },
    },
  ],
  GlobalSecondaryIndexes: [
    {
      IndexName: 'userId-date-index',
      KeySchema: [
        { AttributeName: 'userId', KeyType: 'HASH' },
        { AttributeName: 'date', KeyType: 'RANGE' },
      ],
      ProvisionedThroughput: {
        ReadCapacityUnits: 1,
        WriteCapacityUnits: 1,
      },
      Projection: {
        ProjectionType: 'ALL',
      },
    },
  ],
};

ddb.createTable(params, (err, data) => {
  if (err && !/^Table already/.test(err.message)) {
    console.error(`${params.TableName} Unable to create table. Error JSON: ${JSON.stringify(err, null, 2)}`);
  } else if (!err) {
    console.log(`Created table. Table description JSON:  ${JSON.stringify(data, null, 2)}`);
  }
});

module.exports = params;
```

This code is in the `/app/models/dynamodb/schema/index.js` file.
```js
'use strict';

const fs = require('fs');
const path = require('path');

const result = [];

fs.readdirSync(__dirname).forEach((f) => {
  if (f === 'index.js') return;
  const filePath = path.join(__dirname, f);
  const requireResult = require(filePath);
  if (!requireResult || !requireResult.TableName) return;
  result.push(requireResult);
});

module.exports = result;
```

This code is in the `/app/models/dynamodb/index.js` file.
```js
'use strict';

const { dynamize } = require('../../../libs/aws');
const schema = require('./schema');

schema.forEach((key) => {
  dynamize.model(key.TableName, key);
});

module.exports = dynamize.models;
```

## Create Tables
This code is in the `/app/index.js` file.
```js
const fs = require('fs');
const path = require('path');

require('dotenv').config();

const dynamodbPath = `${__dirname}/models/dynamodb/schema`;

if (process.env.MakeTable) {
    // create dynamo db tables
    fs.readdirSync(dynamodbPath).forEach((file) => {
      if (path.extname(file) === '.js') require(`${dynamodbPath}/${file}`);
    });
}

require('./childProcess');
```

And you can check the tables using the following code.
```js
const { dynamize } = require('./dynamize');

const tables = await dynamize.showTables();
console.log(tables);
```

## Basic Operations
This code is in the `/app/components/v1/event/model/dynamodb/eventLog.js` file.
```js
'use strict';

const { EventLogs } = require('../../../../../models/dynamodb');

exports.createEventLog = async function createEventLog(eventLog) {
  await EventLogs.create(eventLog);
};

exports.getEventLogs = async function getEventLogs(eventId, startDate, endDate) {
  return await EventLogs.find({ eventId: { eq: eventId }, date: { between: [startDate, endDate] } });  
};

exports.getAllEventLogs = async function getAllEventLogs() {
  return await EventLogs.scan();  
};

exports.getEventLog = async function getEventLog(eventId, userId) {
  return await EventLogs.findOne({ eventId: { eq: eventId }, userId: { eq: userId } });  
};

exports.deleteEventLog = async function deleteEventLog(eventId, userId) {
  await EventLogs.delete({ eventId: { eq: eventId }, userId: { eq: userId } });  
};
```
