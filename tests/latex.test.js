'use strict';
var test = require('tape');
var wtf = require('./lib');


function latex_tidy(pSource) {
  /*
  LaTeX: function is necessary for smart equal compare
  due to equivalence in exported latex output and
  output changes that do not affect the correct layout of the code.
  Removing of unnecessary characters that makes the test smarter against
  syntactical layout change that still provide a correct output
  */

  // (1) Comments in Output
  pSource = pSource.replace(/[\s]*%[^\n]\n/g,"");
  //last line is a comment
  pSource = pSource.replace(/[\s]*%[^\n]$/g,"");
  // Comment is a line end starting with % and ending with a newline
  // e.g.   latex test % my Comment
  //        more latex text

  // (2) Newline
  pSource = pSource.replace(/\n[\s]*\n[\s\n]+/g,"\n\n");
  /* more than two newlines \n (optional with spaces in between)
  are equivalent to two newlines.
  */

  // (3) Blanks
  // replace multiple blanks by one blank
  pSource = pSource.replace(/\s[\s]+/g," ");

  /*
  Example for (2) and (3)
  -------------------
  ----SOURCE---------
  -------------------
  My   first
  paragraph


  The    second
  paragraph    with
  more     then     two   lines



  the last paragraph
  -------------------
  ----TIDY SOURCE----
  -------------------
  My first paragraph

  The second paragraph with more then two lines

  the last paragraph
  -------------------
  */

  return pSource
};

test('basic-latex', t => {
  //------------------------------
  var have = wtf.latex('that cat is [[a]] cool dude');
  var want = `that cat is \\href{./A}{a} cool dude`;
  t.equal(latex_tidy(have), latex_tidy(want), 'link');

  have = wtf.latex('that cat is [[ab cd]] cool dude');
  want = `that cat is \\href{./Ab_cd}{ab cd} cool dude`;
  t.equal(latex_tidy(have), latex_tidy(want), 'link-blank');

    have = wtf.latex('that cat is [http://www.wikiversity.org ab cd] cool dude');
    want = `that cat is \\href{http://www.wikiversity.org}{ab cd} cool dude`;
    t.equal(latex_tidy(have), latex_tidy(want), 'link-external');

    // Image simple
    have = wtf.latex(`My image [File:my_image.png]`);
    want = `My image`;
    t.equal(latex_tidy(have), latex_tidy(want), 'one-tick');

    //1 tick
    have = wtf.latex(`i 'think' so`);
    want = `i 'think' so
`;
    t.equal(latex_tidy(have), latex_tidy(want), 'one-tick');

    //2 ticks
    have = wtf.latex(`i ''think'' so`);
    want = `i \\textit{think} so
`;
    t.equal(latex_tidy(have), latex_tidy(want), 'italic');

    //3 ticks
    have = wtf.latex(`i '''think''' so`);
    want = `i \\textbf{think} so
`;
    t.equal(latex_tidy(have), latex_tidy(want), 'bold');

    //4 ticks
    have = wtf.latex(`i ''''think'''' so`);
    want = `i '\\textbf{think}' so
`;
    t.equal(latex_tidy(have), latex_tidy(want), 'four-tick');

    //5 ticks
    have = wtf.latex(`i '''''think''''' so`);
    want = `i \\textbf{\\textit{think}} so
`;
    t.equal(latex_tidy(have), latex_tidy(want), 'five-tick');

    //itemize
    have = wtf.latex(`==My Section==\nLeading text\n* First item\n*Second Item\nClosing remark`);
    want = `\\section{My Section}
  Leading text
  \\begin{itemize}
    \\item First item
    \\item Second item
  \\end{itemize}
  Closing remark`;
    t.equal(latex_tidy(have), latex_tidy(want), 'itemize');
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
  t.equal(latex_tidy(have), latex_tidy(want), 'nested-itemize');

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

    t.equal(latex_tidy(have), latex_tidy(want), 'nested-itemize-enumerate');

  //-----------------------------
  t.end();
});
