'use strict';
var test = require('tape');
var wtf = require('./lib');
var tidy = require('./tidy');


test('basic-latex', t => {
  //------------------------------
  var have = wtf.latex('that cat is [[a]] cool dude');
  var want = `that cat is \\href{./A}{a} cool dude`;
  t.equal(tidy.latex(have), tidy.latex(want), 'link');

  have = wtf.latex('that cat is [[ab cd]] cool dude');
  want = `that cat is \\href{./Ab_cd}{ab cd} cool dude`;
  t.equal(tidy.latex(have), tidy.latex(want), 'link-blank');

    have = wtf.latex('that cat is [http://www.wikiversity.org ab cd] cool dude');
    want = `that cat is \\href{http://www.wikiversity.org}{ab cd} cool dude`;
    t.equal(tidy.latex(have), tidy.latex(want), 'link-external');

    // Image simple
    have = wtf.latex(`My image [File:my_image.png]`);
    want = `My image`;
    t.equal(tidy.latex(have), tidy.latex(want), 'one-tick');

    //1 tick
    have = wtf.latex(`i 'think' so`);
    want = `i 'think' so
`;
    t.equal(tidy.latex(have), tidy.latex(want), 'one-tick');

    //2 ticks
    have = wtf.latex(`i ''think'' so`);
    want = `i \\textit{think} so
`;
    t.equal(tidy.latex(have), tidy.latex(want), 'italic');

    //3 ticks
    have = wtf.latex(`i '''think''' so`);
    want = `i \\textbf{think} so
`;
    t.equal(tidy.latex(have), tidy.latex(want), 'bold');

    //4 ticks
    have = wtf.latex(`i ''''think'''' so`);
    want = `i '\\textbf{think}' so
`;
    t.equal(tidy.latex(have), tidy.latex(want), 'four-tick');

    //5 ticks
    have = wtf.latex(`i '''''think''''' so`);
    want = `i \\textbf{\\textit{think}} so
`;
    t.equal(tidy.latex(have), tidy.latex(want), 'five-tick');

    //itemize
    have = wtf.latex(`==My Section==\nLeading text\n* First item\n*Second Item\nClosing remark`);
    want = `\\section{My Section}
  Leading text
  \\begin{itemize}
    \\item First item
    \\item Second item
  \\end{itemize}
  Closing remark`;
    t.equal(tidy.latex(have), tidy.latex(want), 'itemize');
    //Nested itemize
    have = wtf.html(`==My Section==
  Intro text
  * first item
  ** first subitem of item
  ** second subitem of item
  * second item
  Final remarks`);
    want = `\\section{My Section}
  Leading text
  \\begin{itemize}
    \\item First item
    \\begin{itemize}
      \\item first subitem of item
      \\item second subitem of item
    \\end{itemize}
    \\item Second item
  \\end{itemize}
  Final remarks`
  ;
  t.equal(tidy.latex(have), tidy.latex(want), 'nested-itemize');

    //Nested enumerate in itemize
    have = wtf.html(`Intro text
  * first item
  *# first subitem of item
  *# second subitem of item
  * second item
  Final remarks`);
  want = `\\section{My Section}
  Leading text
  \\begin{itemize}
  \\item First item
  \\begin{enumerate}
    \\item first subitem of item
    \\item second subitem of item
  \\end{enumerate}
  \\item Second item
  \\end{itemize}
  Final remarks
  `;

    t.equal(tidy.latex(have), tidy.latex(want), 'nested-itemize-enumerate');

  //-----------------------------
  t.end();
});
