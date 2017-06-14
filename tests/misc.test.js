'use strict';
var test = require('tape');
const wtf = require('../src/index');

test('small headings', t => {
  let str = `
===gdbserver===
hi there

===x===
Displays memory at the specified virtual address using the specified format.

===xp===
here too
  `;
  let text = wtf.parse(str).text;
  t.ok(text['gdbserver'], 'first heading exists');
  t.ok(text['x'], 'x exists');
  t.ok(text['xp'], 'xp exists');
  t.equal(text['foo'], undefined, 'foo doesnt exist');
  t.end();
});

test('font-size', t => {
  let str = 'hello {{small|(1995-1997)}} world';
  t.equal(wtf.plaintext(str), 'hello (1995-1997) world\n', '{{small}}');

  str = 'hello {{huge|world}}';
  t.equal(wtf.plaintext(str), 'hello world\n', '{{huge}}');

  str = `hello {{nowrap|{{small|(1995–present)}}}} world`;
  t.equal(wtf.plaintext(str), 'hello (1995–present) world\n', '{{nowrap}}');
  t.end();
});
