'use strict';
var test = require('tape');
const wtf = require('../src/index');

test('small headings', (t) => {
  let str = `
===gdbserver===
hi there

===x===
Displays memory at the specified virtual address using the specified format.

===xp===
here too
  `;
  let text = wtf.parse(str).text;
  t.ok(text.get('gdbserver'), 'first heading exists');
  t.ok(text.get('x'), 'x exists');
  t.ok(text.get('xp'), 'xp exists');
  t.end();
});
