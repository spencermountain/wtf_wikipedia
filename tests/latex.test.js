'use strict';
var test = require('tape');
var wtf = require('./lib');
var tidy = require('./lib/tidy').latex;

test('basic-latex', t => {
  var have = wtf('that cat is [[a]] cool dude').latex();
  var want = 'that cat is \\href{./A}{a} cool dude';
  t.equal(tidy(have), tidy(want), 'link');

  have = wtf('that cat is [[ab cd]] cool dude').latex();
  want = 'that cat is \\href{./Ab_cd}{ab cd} cool dude';
  t.equal(tidy(have), tidy(want), 'link-blank');

  have = wtf('that cat is [http://www.wikiversity.org ab cd] cool dude').latex();
  want = 'that cat is \\href{http://www.wikiversity.org}{ab cd} cool dude';
  t.equal(tidy(have), tidy(want), 'link-external');

  //   // Image simple
  // have = wtf(`My image [File:my_image.png]`).latex();
  // want = `My image`;
  // t.equal(tidy(have), tidy(want), 'image');
  t.end();
});

test('latex-formatting', t => {
  //1 tick
  // var have = wtf(`i 'think' so`).latex();
  // var want = `i 'think' so`;
  // t.equal(tidy(have), tidy(want), 'one-tick');
  // //
  // //   //2 ticks
  // have = wtf(`i ''think'' so`).latex();
  // want = 'i \\extit{think} so';
  // t.equal(tidy(have), tidy(want), 'italic');
  //
  // //3 ticks
  // have = wtf(`i '''think''' so`).latex();
  // want = 'i \\extbf{think} so';
  // t.equal(tidy(have), tidy(want), 'bold');
  //
  // //4 ticks
  // have = wtf(`i ''''think'''' so`).latex();
  // want = 'i \'\\extbf{think}\' so';
  // t.equal(tidy(have), tidy(want), 'four-tick');
  //
  // //5 ticks
  // have = wtf(`i '''''think''''' so`).latex();
  // want = 'i 	\\extbf{	extit{think}} so';
  // t.equal(tidy(have), tidy(want), 'five-tick');
  t.end();
});

test('latex-lists', t => {
  //itemize
  // var have = wtf(`==My Section==
  // Leading text
  // * First item
  // *Second Item
  // Closing remark`).latex();
  // var want = `section{My Section}
  //   Leading text
  //   egin{itemize}
  //     item First item
  //     item Second item
  //   end{itemize}
  //   Closing remark`;
  // t.equal(tidy(have), tidy(want), 'itemize');
  //
  //Nested itemize
  // have = wtf(`==My Section==
  // Intro text
  // * first item
  // ** first subitem of item
  // ** second subitem of item
  // * second item
  // Final remarks`).latex();
  //
  // want = `section{My Section}
  //   Leading text
  //   egin{itemize}
  //     item First item
  //     egin{itemize}
  //       item first subitem of item
  //       item second subitem of item
  //     end{itemize}
  //     item Second item
  //   end{itemize}
  //   Final remarks`;
  // t.equal(tidy(have), tidy(want), 'nested-itemize');
  //
  // //Nested enumerate in itemize
  // have = wtf(`Intro text
  //   * first item
  //   *# first subitem of item
  //   *# second subitem of item
  //   * second item
  //   Final remarks`).html();
  // want = `section{My Section}
  //   Leading text
  //   egin{itemize}
  //   item First item
  //   egin{enumerate}
  //     item first subitem of item
  //     item second subitem of item
  //   end{enumerate}
  //   item Second item
  //   end{itemize}
  //   Final remarks`;
  // t.equal(tidy(have), tidy(want), 'nested-itemize-enumerate');

  t.end();
});
