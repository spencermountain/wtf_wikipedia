// /* 
EXPORT MarkDown
---------------
See markdown-it-katex at GitHub: https://github.com/waylonflinn/markdown-it-katex
To render the generated markdown nicely to HTML.

The following MediaWiki source text containd embedded mathematical expressions inline and as separated line ":<math>...":

this are embedded mathematical expressions in MediaWiki source text:
This expression <math> f(x) </math> is a mathematical INLINE expression. 
The next line is a BLOCK expression in a separate line.
:<math> f(x) </math>
This is the text below the BLOCK expression.
*/


// handle inline mathematical expression
const doMathInline = (pMath, options) => {
 let out = '$' + pMath + '$';
  // use https://www.npmjs.com/package/markdown-it-katex to render the MathCode
  return out;
};

// handle mathematical expression displayed in a separate line
const doMathBlock = (pMath, options) => {
 let out = '$$' + pMath + '$$';
  return out;
};

module.exports = {
	doMathInline  : doMathInline,
	doMathBlock : doMathBlock
}