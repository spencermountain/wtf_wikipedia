'use strict';
var test = require('tape');
var wtf = require('./lib');


test('basic-latex', t => {
  var have = wtf.latex('that cat is [[a]] cool dude');
  var want = `that cat is \\href{./A}{a} cool dude`;
  console.log("basic-latex have='"+have+"'");
  t.equal(latex_tidy(have), latex_tidy(want), 'link');

  var have = wtf.latex('that cat is [[ab cd]] cool dude');
  var want = `that cat is \\href{./Ab_cd}{ab cd} cool dude`;
  t.equal(latex_tidy(have), latex_tidy(want), 'link-blank');

  var have = wtf.latex('that cat is [http://www.wikiversity.org ab cd] cool dude');
  var want = `that cat is \\href{http://www.wikiversity.org}{ab cd} cool dude`;
  t.equal(latex_tidy(have), latex_tidy(want), 'link-external');

  // Image simple
  have = wtf.latex(`My image [File:]`);
  want = `i 'think' so`;
  t.equal(latex_tidy(have), latex_tidy(want), 'one-tick');

  //1 tick
  have = wtf.latex(`i 'think' so`);
  want = `i 'think' so`;
  t.equal(latex_tidy(have), latex_tidy(want), 'one-tick');


  //2 ticks
  have = wtf.latex(`i ''think'' so`);
  want = `i \\textbf{think} so`;
  t.equal(latex_tidy(have), latex_tidy(want), 'italic');

  //3 ticks
  have = wtf.latex(`i '''think''' so`);
  want = `i \\textbf{think} so`;
  t.equal(latex_tidy(have), latex_tidy(want), 'bold');

  //4 ticks
  have = wtf.latex(`i ''''think'''' so`);
  want = `i '\\textbf{think}' so`;
  t.equal(latex_tidy(have), latex_tidy(want), 'four-tick');

  //5 ticks
  have = wtf.latex(`i '''''think''''' so`);
  want = `i \\textit{\\textbf{think}} so`;
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
Final remarks`;
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
Final remarks`;

  t.equal(latex_tidy(have), latex_tidy(want), 'nested-itemize-enumerate');

  t.end();
});
