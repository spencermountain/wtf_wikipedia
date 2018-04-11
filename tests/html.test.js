'use strict';
var test = require('tape');
var wtf = require('./lib');
var tidy = require('./tidy');

// tidy.html() defined in tidy.js

test('basic-html', t => {

  var have = wtf.html('that cat is [[a]] cool dude');
  var want = `<div class="section">
  <p>that cat is <a class="link" href="./A">a</a> cool dude</p>
</div>
`;
t.equal(tidy.html(have), tidy.html(want), 'link');

  have = wtf.html('that cat is [[ab cd]] cool dude');
  want = `<div class="section">
  <p>that cat is <a class="link" href="./Ab_cd">ab cd</a> cool dude</p>
</div>
`;
t.equal(tidy.html(have), tidy.html(want), 'link-blank');

  have = wtf.html('that is my image [[File:my_cat.png]]. Really cool');
  want = `<div class="section">
  <p>that is my image
  <src class="imgsimple" src="https://en.wikipedia.org/wiki/Special:Redirect/file/my_cat.png">.
  Really cool</p>
</div>
`;
  t.equal(tidy.html(have), tidy.html(want), 'image-simple');

  have = wtf.html('that is my image [[File:my_cat.png|center|700px|Image "Caption" for Cat]]. Really cool');
  want = `<div class="section">
     that is my image
     <div class="imgcenter">
       <img src="https://en.wikipedia.org/wiki/Special:Redirect/file/my_cat.png" width="700px" alt="Image \"Caption\" for Cat"/>.
     </div>
     Really cool</p></div>
`;
  t.equal(tidy.html(have), tidy.html(want), 'image-center-size-caption');

  have = wtf.html('that cat in [http://www.wikiversity.org other Wiki] is cool');
  want = `<div class="section">
 <p>that cat in <a class="link external" href="http://www.wikiversity.org" target="_blank">other Wiki</a> is cool</p>
</div>
`;
 t.equal(tidy.html(have), tidy.html(want), 'link-external');

 //1 tick
 have = wtf.html(`i 'think' so`);
 want = `<div class="section">
 <p>i 'think' so</p>
</div>
`;
 t.equal(tidy.html(have), tidy.html(want), 'one-tick');

 //2 ticks
 have = wtf.html(`i ''think'' so`);
 want = `<div class="section">
 <p>i <i>think</i> so</p>
</div>
`;
 t.equal(tidy.html(have), tidy.html(want), 'italic');

 //3 ticks
 have = wtf.html(`i '''think''' so`);
 want = `<div class="section">
 <p>i <b>think</b> so</p>
 </div>
 `;
 t.equal(tidy.html(have), tidy.html(want), 'bold');

 //4 ticks
 have = wtf.html(`i ''''think'''' so`);
 want = `<div class="section">
 <p>i '<b>think</b>' so</p>
</div>
`;
 t.equal(tidy.html(have), tidy.html(want), 'four-tick');

 //5 ticks
 have = wtf.html(`i '''''think''''' so`);
 want = `<div class="section">
 <p>i <b><i>think</i></b> so</p>
</div>
`;
 t.equal(tidy.html(have), tidy.html(want), 'five-tick');

 //Nested itemize
 have = wtf.html(`Intro text
* first item
** first subitem of item
** second subitem of item
* second item
Final remarks`);
 want = `<div class="section">
<p>Intro text
 <ul>
   <li>
     First item
     <ul>
       <li>first subitem of item/li>
       <li>second subitem of item/li>
     </ul>
   </li>
   <li>
     Second item
   </li>
 </ul>
 Final remarks</p>
</div>
`;
 t.equal(tidy.html(have), tidy.html(want), 'nested-itemize');

 //Nested enumerate in itemize
 have = wtf.html(`Intro text
* first item
*# first subitem of item
*# second subitem of item
* second item
Final remarks`);

 want = `<div class="section">
<p>Intro text
 <ul>
   <li>
     First item
     <ol>
       <li>first subitem of item/li>
       <li>second subitem of item/li>
     </ol>
   </li>
   <li>
     Second item
   </li>
 </ul>
 Final remarks</p>
</div>
`;
 t.equal(tidy.html(have), tidy.html(want), 'nested-itemize-enumerate');

//-------------------
  t.end();
});
