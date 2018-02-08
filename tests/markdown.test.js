'use strict';
var test = require('tape');
const wtf = require('./lib');

test('basic-markdown', t => {
  let md = wtf.markdown('he is [[Spencer Kelly|so cool]] and [http://cool.com fresh]');

  t.equal(md, 'he is [so cool](./Spencer_Kelly) and [fresh](http://cool.com)', 'internal, external links');
  t.end();
});
