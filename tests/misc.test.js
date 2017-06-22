'use strict';
var test = require('tape');
const wtf = require('../src/index');

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
