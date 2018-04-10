if (typeof process !== undefined && typeof module !== undefined) {
  if (process.env.TESTENV === 'prod') {
    console.log('== production build test 🚀 ==');
    // module.exports = require('../../builds/efrt');
    module.exports = require('../../builds/wtf_wikipedia.min.js');
  } else {
    module.exports = require('../../src/index');
  }
}

function html_tidy(pSource) {
  /*
  HTML: function is necessary for smart equal compare
  due to equivalence in exported output
  remove unnecessary characters that makes the test smarter against
  syntactical layout change that still provide a correct output
  */

  // (1) Comments in Output
  pSource = pSource.replace(/<!--[^>]*-->/g,"");

  // (2) Newline
  pSource = pSource.replace(/\n/g,"");
  // newline \n does not matter in HTML, but newlines are helpful
  // for a more comprehensive output.
  // Newlines can make the test fail, even if the generated code is OK.
  // Therefore remove newlines in a tidy source

  // (3) Blanks
  // replace multiple blanks by one blank
  pSource = pSource.replace(/\s[\s]+/g," ");
  // remove blanks before closing a tag with ">"
  pSource = pSource.replace(/ >/g,">");

  return pSource
};

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
