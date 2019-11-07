'use strict';
var test = require('tape');
var wtf = require('./lib');
var tidy = require('./tidy');

// tidy.reveal() defined in tidy.js


test('basic-reveal', t => {
  var have = wtf.reveal('that cat is [[a]] cool dude');
  var want = `<section class="level2">
  <p>that cat is <a class="link" href="./A">a</a> cool dude</p>
</section>
`;
  t.equal(tidy.reveal(have), tidy.reveal(want), 'link');

  var have = wtf.reveal('that cat is [[ab cd]] cool dude');
  var want = `<section class="level2">
  <p>that cat is <a class="link" href="./Ab_cd">ab cd</a> cool dude</p>
</section>
`;
  t.equal(tidy.reveal(have), tidy.reveal(want), 'link-blank');

  var have = wtf.reveal('that cat in [http://www.wikiversity.org other Wiki] is cool');
  var want = `<section class="level2">
  <p>that cat in <a class="link external" href="http://www.wikiversity.org" target="_blank">other Wiki</a> is cool</p>
</section>
`;
  t.equal(tidy.reveal(have), tidy.reveal(want), 'link-external');

  //1 tick
  have = wtf.reveal(`i 'think' so`);
  want = `<section class="level2">
  <p>i 'think' so</p>
</section>
`;
  t.equal(tidy.reveal(have), tidy.reveal(want), 'one-tick');

  //2 ticks
  have = wtf.reveal(`i ''think'' so`);
  want = `<section class="level2">
  <p>i <i>think</i> so</p>
</section>
`;
  t.equal(tidy.reveal(have), tidy.reveal(want), 'italic');

  //3 ticks
  have = wtf.reveal(`i '''think''' so`);
  want = `<section class="level2">
  <p>i <b>think</b> so</p>
</section>
`;
  t.equal(tidy.reveal(have), tidy.reveal(want), 'bold');

  //4 ticks
  have = wtf.reveal(`i ''''think'''' so`);
  want = `<section class="level2">
  <p>i '<b>think</b>' so</p>
</section>
`;
  t.equal(tidy.reveal(have), tidy.reveal(want), 'four-tick');

  //5 ticks
  have = wtf.reveal(`i '''''think''''' so`);
  want = `<section class="level2">
  <p>i <b><i>think</i></b> so</p>
</section>
`;
  t.equal(tidy.reveal(have), tidy.reveal(want), 'five-tick');

// thumb images are converted into single slides
  have = wtf.reveal('that is my image [[File:my_cat.png|thumb|Image "Caption" for Cat]]. Really cool');
  want = `<section class="level2">
     that is my image
  </section>
  <section class="level2"  data-background="https://en.wikipedia.org/wiki/Special:Redirect/file/my_cat.png">
    Image "Caption" for Cat
  </section>
  <section class="level2">
     Really cool
  </section>
  `;
  t.equal(tidy.reveal(have), tidy.reveal(want), 'image-thumb-slide');

  have = wtf.reveal('==First Slide==\nthat is my image [[File:my_cat.png|thumb|Title on Background Image]]  \n  \n==Third Slide==\nReally cool');
  want = `<section class="level2">
    <h2>First Slide</h2>
     that is my image
  </section>
  <section class="level2"  data-background="https://en.wikipedia.org/wiki/Special:Redirect/file/my_cat.png">
    Title on Background Image
  </section>
  <section class="level2">
    <h2>Third Slide</h2>
     Really cool
  </section>
  `;
  t.equal(tidy.reveal(have), tidy.reveal(want), 'image-thumb-end-section');

  have = wtf.reveal('[[File:my_cat.png|thumb|  ]]  \n  \n==Third Slide==\nReally cool');
  want = `<section class="level2"  data-background="https://en.wikipedia.org/wiki/Special:Redirect/file/my_cat.png">

  </section>
  <section class="level2">
    <h2>Third Slide</h2>
     Really cool
  </section>
  `;
  t.equal(tidy.reveal(have), tidy.reveal(want), 'image-thumb-begin-slide');

  t.end();
});
