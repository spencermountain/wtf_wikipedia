'use strict';
var test = require('tape');
var wtf = require('./lib');


test('basic-reveal', t => {
  var have = wtf.reveal('that cat is [[a]] cool dude');
  var want = `<section class="level2">
  <p>that cat is <a class="link" href="./A">a</a> cool dude</p>
</section>
`;
  t.equal(html_tidy(have), html_tidy(want), 'link');

  var have = wtf.reveal('that cat is [[ab cd]] cool dude');
  var want = `<section class="level2">
  <p>that cat is <a class="link" href="./Ab_cd">ab cd</a> cool dude</p>
</section>
`;
  t.equal(html_tidy(have), html_tidy(want), 'link-blank');

  var have = wtf.reveal('that link to the [http://www.wikiversity.org other Wiki] is cool');
  var want = `<section class="level2">
  <p>that cat is <a class="link external" href="http://www.wikiversity.org" target="_blank">other Wiki</a> is cool</p>
</section>
`;
  t.equal(html_tidy(have), html_tidy(want), 'link-external');

  //1 tick
  have = wtf.reveal(`i 'think' so`);
  want = `<section class="level2">
  <p>i 'think' so</p>
</section>
`;
  t.equal(html_tidy(have), html_tidy(want), 'one-tick');

  //2 ticks
  have = wtf.reveal(`i ''think'' so`);
  want = `<section class="level2">
  <p>i <i>think</i> so</p>
</section>
`;
  t.equal(html_tidy(have), html_tidy(want), 'italic');

  //3 ticks
  have = wtf.reveal(`i '''think''' so`);
  want = `<section class="level2">
  <p>i <b>think</b> so</p>
  </section>
  `;
  t.equal(html_tidy(have), html_tidy(want), 'bold');

  //4 ticks
  have = wtf.reveal(`i ''''think'''' so`);
  want = `<section class="level2">
  <p>i '<b>think</b>' so</p>
</section>
`;
  t.equal(html_tidy(have), html_tidy(want), 'four-tick');

  //5 ticks
  have = wtf.reveal(`i '''''think''''' so`);
  want = `<section class="level2">
  <p>i <b><i>think</i></b> so</p>
</section>
`;
  t.equal(html_tidy(have), html_tidy(want), 'five-tick');

  t.end();
});
