'use strict';

const { Dynamize } = require('../');

const dynamize = new Dynamize({ region: 'us-west-2' });

dynamize.model('test.cw.catalog');

const { TestCwCatalog: DB } = dynamize.models;

async function main() {
  const data = await DB.scan();
  console.log('test data: ', data);
}

main().then();
