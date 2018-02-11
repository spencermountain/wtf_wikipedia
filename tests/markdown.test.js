'use strict';
var test = require('tape');
const wtf = require('./lib');

// var fetch = function(file) {
//   file = file.replace(/ /g, '-');
//   return fs.readFileSync(path.join(__dirname, 'cache', file + '.txt'), 'utf-8');
// };

test('basic-markdown', t => {
  let md = wtf.markdown('he is [[Spencer Kelly|so cool]] and [http://cool.com fresh]');
  t.equal(md, 'he is [so cool](./Spencer_Kelly) and [fresh](http://cool.com)', 'internal, external links');

  md = wtf.markdown('hello [[Image:1930s Toronto KingStreetWnearYork.jpg|thumb|right|250px]] world');
  t.equal(md, `![1930s Toronto KingStreetWnearYork](https://upload.wikimedia.org/wikipedia/commons/thumb/6/60/1930s_Toronto_KingStreetWnearYork.jpg/300px-1930s_Toronto_KingStreetWnearYork.jpg)
hello world`, 'image');
  t.end();
});

test('tricky-markdown', t => {
  let md = wtf.markdown('the is [[he]] nice');
  t.equal(md, 'the is [he](./He) nice', 'matches whole-word');

  md = wtf.markdown('the is [[he]]. nice');
  t.equal(md, 'the is [he](./He). nice', 'matches with-period');

  md = wtf.markdown('stim\'s is [[tim]]\'s son');
  t.equal(md, 'stim\'s is [tim\'s](./Tim) son', 'matches with apostrophe');

  t.end();
});
