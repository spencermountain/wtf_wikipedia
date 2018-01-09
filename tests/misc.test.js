'use strict';
var test = require('tape');
const wtf = require('./lib');

test('small headings', t => {
  let str = `
hello
===gdbserver===
hi there

===x===
Displays memory at the specified virtual address using the specified format.

===xp===
here too
  `;
  let sections = wtf.parse(str).sections;
  t.equal(sections[1].title, 'gdbserver', 'first heading exists');
  t.equal(sections[2].title, 'x', 'x exists');
  t.ok(sections[3].title, 'xp', 'xp exists');
  t.equal(sections[4], undefined, 'foo doesnt exist');
  t.end();
});

test('font-size', t => {
  let str = 'hello {{small|(1995-1997)}} world';
  t.equal(wtf.plaintext(str), 'hello (1995-1997) world', '{{small}}');

  str = 'hello {{huge|world}}';
  t.equal(wtf.plaintext(str), 'hello world', '{{huge}}');

  str = `hello {{nowrap|{{small|(1995–present)}}}} world`;
  t.equal(wtf.plaintext(str), 'hello (1995–present) world', '{{nowrap}}');
  t.end();
});

test('external links', t => {
  let str = `The [http://w110.bcn.cat/portal/site/Eixample] is the quarter designed`;
  let obj = wtf.parse(str);
  let link = obj.sections[0].sentences[0].links[0];
  t.equal(link.text, '', 'link-text');
  t.equal(link.site, 'http://w110.bcn.cat/portal/site/Eixample', 'link-site');
  t.equal(link.type, 'external', 'link-type');

  str = `The [http://w110.bcn.cat/portal/site/Eixample Fun Times] is the quarter designed`;
  obj = wtf.parse(str);
  link = obj.sections[0].sentences[0].links[0];
  t.equal(link.text, 'Fun Times', 'link-text');
  t.equal(link.site, 'http://w110.bcn.cat/portal/site/Eixample', 'link-site');
  t.equal(link.type, 'external', 'link-type');
  t.end();
});

test('refn template', t => {
  var str = `hello {{refn|group=groupname|name=name|Contents of the footnote}} world`;
  t.equal(wtf.parse(str).sections[0].sentences[0].text, 'hello world');
  t.end();
});
