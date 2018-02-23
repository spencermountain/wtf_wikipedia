'use strict';
var test = require('tape');
var wtf = require('./lib');


test('basic-html', t => {
  var have = wtf.html('that cat is [[a]] cool dude');
  var want = `<div class="section">
  <p>that cat is <a class="link" href="./A">a</a> cool dude</p>
</div>
`;
  t.equal(have, want, 'link');

  //1 tick
  have = wtf.html(`i 'think' so`);
  want = `<div class="section">
  <p>i 'think' so</p>
</div>
`;
  t.equal(have, want, 'bold');

  //2 ticks
  have = wtf.html(`i '''think''' so`);
  want = `<div class="section">
  <p>i <b>think</b> so</p>
</div>
`;
  t.equal(have, want, 'bold');

  //3 ticks
  have = wtf.html(`i ''think'' so`);
  want = `<div class="section">
  <p>i <i>think</i> so</p>
</div>
`;
  t.equal(have, want, 'italic');

  //4 ticks
  have = wtf.html(`i ''''think'''' so`);
  want = `<div class="section">
  <p>i '<b>think</b>' so</p>
</div>
`;
  t.equal(have, want, 'four-tick');

  //5 ticks
  have = wtf.html(`i '''''think''''' so`);
  want = `<div class="section">
  <p>i <b><i>think</i></b> so</p>
</div>
`;
  t.equal(have, want, 'five-tick');

  t.end();
});
