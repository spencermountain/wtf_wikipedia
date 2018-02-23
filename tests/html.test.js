'use strict';
var test = require('tape');
const wtf = require('./lib');


test('basic-html', t => {
  let have = wtf.html('that cat is [[a]] cool dude');
  let want = `<div class="section">
  <p>that cat is <a class="link" href="./A">a</a> cool dude</p>
</div>
`;
  t.equal(have, want, 'link');

  t.end();
});
