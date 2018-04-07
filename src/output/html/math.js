/* 
EXPORT HTML
------------
The following MediaWiki source text containd embedded mathematical expressions inline and as separated line ":<math>...":

This expression <math> f(x) </math> is a mathematical INLINE expression. 
The next line is a BLOCK expression in a separate line.
:<math> f(x) </math>
This is the text below the BLOCK expression.
*/


// handle inline mathematical expression
const doMathInline = (pMath, options) => {
  // pMath is internal LaTeX code for the mathematical expression e.g. "f(x)"
  // pMath does not contain the wrapped <math>-tags from the MediaWiki source
  let out = '\(' + pMath + '\)';
  return out ;
};

// handle mathematical expression displayed in a separate line
const doMathBlock = (pMath, options) => {
  let out = '\n\[' + pMath + '\]';
  return out + '\n';
};

// Export the two functions
module.exports = {
	doMathInline  : doMathInline,
	doMathBlock : doMathBlock
}