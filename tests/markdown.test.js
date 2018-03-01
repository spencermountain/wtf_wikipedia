'use strict';
var test = require('tape');
var wtf = require('./lib');

// var fetch = function(file) {
//   file = file.replace(/ /g, '-');
//   return fs.readFileSync(path.join(__dirname, 'cache', file + '.txt'), 'utf-8');
// };

test('basic-markdown', t => {
  var md = wtf('he is [[Spencer Kelly|so cool]] and [http://cool.com fresh]').toMarkdown();
  t.equal(md, 'he is [so cool](./Spencer_Kelly) and [fresh](http://cool.com)', 'internal, external links');

  md = wtf('hello [[Image:1930s Toronto KingStreetWnearYork.jpg|thumb|right|250px]] world').toMarkdown();
  t.equal(md, `![1930s Toronto KingStreetWnearYork](https://upload.wikimedia.org/wikipedia/commons/thumb/6/60/1930s_Toronto_KingStreetWnearYork.jpg/300px-1930s_Toronto_KingStreetWnearYork.jpg)
hello world`, 'image');

  md = wtf(`he is ''really good''`).toMarkdown();
  t.equal(md, 'he is *really good*', 'multi-word italic');

  md = wtf(`he is '''really good'''`).toMarkdown();
  t.equal(md, 'he is **really good**', 'multi-word bold');

  md = wtf(`he is ''''really good''''`).toMarkdown();
  t.equal(md, 'he is \'**really good**\'', 'four-ticks');

  md = wtf(`he is '''''really good'''''`).toMarkdown();
  t.equal(md, 'he is ***really good***', 'bold+italics');
  t.end();
});

test('markdown-tricks', t => {
  var md = wtf('the is [[he]] nice').toMarkdown();
  t.equal(md, 'the is [he](./He) nice', 'matches whole-word');

  md = wtf('the is [[he]]. nice').toMarkdown();
  t.equal(md, 'the is [he](./He). nice', 'matches with-period');

  md = wtf('stim\'s is [[tim]]\'s son').toMarkdown();
  t.equal(md, 'stim\'s is [tim\'s](./Tim) son', 'matches with apostrophe');

  md = wtf(`we put the '''e''' in team`).toMarkdown();
  t.equal(md, 'we put the **e** in team', 'fmt supports smartReplace');

  t.end();
});
