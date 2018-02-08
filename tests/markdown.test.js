'use strict';
var test = require('tape');
const wtf = require('./lib');

test('basic-markdown', t => {
  let md = wtf.markdown('he is [[Spencer Kelly|so cool]] and [http://cool.com fresh]');
  t.equal(md, 'he is [so cool](./Spencer_Kelly) and [fresh](http://cool.com)', 'internal, external links');

  md = wtf.markdown('hello [[Image:1930s Toronto KingStreetWnearYork.jpg|thumb|right|250px]] world');
  t.equal(md, `![1930s Toronto KingStreetWnearYork](https://upload.wikimedia.org/wikipedia/commons/thumb/6/60/1930s_Toronto_KingStreetWnearYork.jpg/300px-1930s_Toronto_KingStreetWnearYork.jpg)
hello world`, 'image');
  t.end();
});
