'use strict';
var test = require('tape');
var wtf = require('./lib');
var tidy = require('./lib/tidy');

test('basic-html', t => {
  var have = wtf('that cat is [[a]] cool dude').html();
  var want = `<div class="section">
  <div class="text">
    <span class="sentence">that cat is <a class="link" href="./A">a</a> cool dude</span>
  </div>
</div>
`;
  t.equal(tidy.html(have), tidy.html(want), 'link');

  //1 tick
  have = wtf(`i 'think' so`).html();
  want = `<div class="section">
  <div class="text">
    <span class="sentence">i 'think' so</span>
  </div>
</div>
`;
  t.equal(tidy.html(have), tidy.html(want), 'link-blank');


  //2 ticks
  have = wtf(`i ''think'' so`).html();
  want = `<div class="section">
  <div class="text">
    <span class="sentence">i <i>think</i> so</span>
  </div>
</div>
`;
  t.equal(have, want, 'italic');

  //3 ticks
  have = wtf(`i '''think''' so`).html();
  want = `<div class="section">
  <div class="text">
    <span class="sentence">i <b>think</b> so</span>
  </div>
</div>
`;
  t.equal(have, want, '3-ticks');

  //4 ticks
  have = wtf(`i ''''think'''' so`).html();
  want = `<div class="section">
  <div class="text">
    <span class="sentence">i '<b>think</b>' so</span>
  </div>
</div>
`;
  t.equal(tidy.html(have), tidy.html(want), '4 ticks');

  //5 ticks
  have = wtf(`i '''''think''''' so`).html();
  want = `<div class="section">
  <div class="text">
    <span class="sentence">i <b><i>think</i></b> so</span>
  </div>
</div>
`;
  t.equal(tidy.html(have), tidy.html(want), '5-ticks');

  //-------------------
  t.end();
});
