
# Mathematical Expressions
Mathematical expressions are used in many scientific and educational content (not only core mathematical disciplines like Calculus, Algebra, Geometry, Statistics,...). Mathematical expressions are used when specific content can be described in precise form of a finite combination of symbols that is well-formed according to rules that depend on the context in which the expression is used. A precise description of the methodology may include mathematical expression by which the results are determined.
Removing the mathematical expressions from the MediaWiki content may result in an incomprehensive text fragement.

This section describes the basic principles of handling mathematical expressions. The export functions are defined as library `math.js` in the subdirectories of `/src/output/`.


<span style="color: red">Important Remark:</span> Currently the export functions are defined already but the export of the parsed syntax tree of the document will not call these functions. A regular expression must distinguish the inline math from block math.
The following code finds all `math`-tags
```javascript
var scripttext = "before text  <math> f(x) = x^2 </math> middle text \n:<math> g(x) = sin(x)+cos(x) </math> \n after text"
var re_all = /<math>(.*)<\/math>/gim;
var re_block = /\n[:]+<math>(.*)<\/math>/gim;
// block RE: newline "\n" with  one or more indent symbols ":".
// ":" shifts the mathematical expression in the block to the right, when placed directly behind newline

var match;
while (match = re_all.exec(scripttext)) {
  // full match is in match[0], whereas captured groups (i.e. the LaTeX math expression) are in match[1].
  console.log(match[1]);
}
```


## Inline Math and Display Math in Separate Lines
In the german Wikiversity article about [mathematical Norms and Topology](https://de.wikiversity.org/wiki/Normen,_Metriken,_Topologie) you will recognize
* (`INLINE`) inline mathematical expressions in the text and
* (`BLOCK`) separated mathematical expression in a single line.
These two different applications of mathematical expressions can be distinguished by a leading colon ":" in the first column of Wiki Markdown article. In the following example `f(x)` is representation of a [mathematical expression in LaTeX](https://www.mediawiki.org/wiki/Extension:Math/Help:Formula).
```html
This expression <math> f(x) </math> is a mathematical INLINE expression.
The next line is a BLOCK expression in a separate line.
:<math> f(x) </math>
This is the text below the BLOCK expression.
```
The following functions are defined as library `/src/output/latex/math.js` and both functions declare the export of the mathematical expression provided in the parameter `pMath` in [LaTeX syntax](https://en.wikibooks.org/wiki/LaTeX/Mathematics).
```javascript
// handle inline mathematical expression
const doMathInline = (pMath, options) => {
  // pMath is internal LaTeX code for the mathematical expression e.g. "f(x)"
  // pMath does not contain the wrapped <math>-tags from the MediaWiki source
 let out = '$' + pMath + '$';
  return out ;
};

// handle mathematical expression displayed in a separate line
const doMathBlock = (pMath, options) => {
  let out = '\[' + pMath + '\]';
  return out + ' ';
};
```
Every export format has a subdirectory in `/src/output/` and all subdirectories have a `math.js` library with mainly two functions
* `doMathInline(pMath, options)` to handle inline mathematical expressions and
* `doMathBlock(pMath, options)` to handle mathematical expressions is separate lines as a block.


## Regular Expressions to determine Inline and Display Math (ToDo)
If we decompose all tasks of `wtf_wikipedia` in the main 3 tasks:
* `wtf_fetch` to download the wiki markdown from the MediaWiki API,
* `wtf_parse` to create an Abstract Syntax Tree AST from the wiki markdown and
* `wtf_output` to generate different output formats from the AST like [PanDoc](https://www.pandoc.org),

The handling of math expressions in `wtf_wikipedia` is addressing
* `wtf_parse` with detection if math expressions are `INLINE` or `BLOCK` and
* with rendering the LaTeX code for the math expression to a specific output format in `wtf_output` task.

Regular expressions can be used to determine what display format of the mathematical expression is intended by the authors of the Wiki MarkDown article.

* (`BLOCK`) First determine the DisplayMath by a regular expression with a
  * newline, colon and `math`-tag opening the block with the mathematical expression in LaTeX syntax,
  * the mathematical expression in LaTeX syntax itself and
  * closing `math`-Tag
* (`INLINE`) after replacement of `BLOCK` expressions the remained mathematical expressions wrapped in `math`-tags can be treated as `INLINE` math.
The export functions are defined in `/src/output/` under the respective export formats e.g.
* `/src/output/latex` for LaTeX,
* `/src/output/html` for HTML,
* `/src/output/markdown` for MarkDown with (KaTeX for rendering the mathematical expressions)

## Handling Mathematical Expressions in Export Formats

Inline with the export design with helper functions the processing of the mathematical expressions can be done with
* helper function (similar to sentences, ... (see folder `/src/output` in the `wtf_wikipedia` repository) (NOT IMPLEMENTED) or
* as work around do the preprocessing of the Wiki Markdown sources befor performing the export of the markdown source so that the mathematical expressions are not removed.
### LaTeX
The easiest export format is LaTeX due to the fact, that the mathematical expressions in the Wiki Markdown article is written in LaTeX syntax. Therefore a cross-compilation of the latex syntax is not necessary.
* (`INLINE`) inline mathematical expressions are wrapped with TWO Dollar symbols, that replaces the opening and closing `math`-tags.
* (`BLOCK`) separated mathematical expression are wrapped with a blackslash followed by an opening respectively closing square brackets.
The following latex code shows the converted Wiki markdown text in latex syntax:
```latex
This expression $ f(x) $ is a mathematical INLINE expression.
The next line is a BLOCK expression in a separate line.
\[ f(x) \]
This is the text below the BLOCK expression.
```

### HTML and MathJax
The easiest way to export MediaWiki markdown article into HTML with mathematical expression is [MathJax](https://www.mathjax.org/), due to the fact, that MathJax can render mathematical expressions in the Wiki Markdown article is written in LaTeX syntax. Therefore a cross-compilation of the latex syntax is not necessary.
* (`INLINE`) inline mathematical expressions are wrapped with TWO Dollar symbols, that replaces the opening and closing `math`-tags.
* (`BLOCK`) separated mathematical expression are wrapped with a blackslash followed by an opening respectively closing square brackets.
To allow mathematical expression rendering with MathJax
* insert the [MathJax library as script tag in the output HTML file](https://www.mathjax.org/#gettingstarted) (for online use remote CDN - for offline use and integrate MathJax download a [MathJax ZIP copy and unzip on your computer](https://github.com/mathjax/MathJax/archive/master.zip) )  
* replace the opening and closing tags for `INLINE` and `BLOCK` with the following symbols
  * (`INLINE`) inline mathematical expressions are wrapped with a blackslash followed by an opening respectively closing bracket.
  * (`BLOCK`) line separated mathematical expression are wrapped with a blackslash followed by an opening respectively closing square brackets.
The following latex code shows the converted Wiki markdown text in HTML syntax including the HTML header.
```html
<!DOCTYPE html>
<html>
<head>
<title>MathJax TeX Test Page</title>
  <script type="text/javascript" async
  	src="https://cdnjs.cloudflare.com/ajax/libs/mathjax/2.7.4/latest.js?config=TeX-MML-AM_CHTML">
  </script>
</head>
<body>
This expression \( f(x) \) is a mathematical INLINE expression.
The next line is a BLOCK expression in a separate line.
\[ f(x) \]
This is the text below the BLOCK expression.
</body>
</html>
```

With a [local MathJax installation](http://docs.mathjax.org/en/latest/start.html#installing-your-own-copy-of-mathjax) on your harddrive or server replace the [MathJax CDN link](http://docs.mathjax.org/en/latest/start.html) by the [appropriate path](http://docs.mathjax.org/en/latest/start.html#installing-your-own-copy-of-mathjax)
e.g. as a subfolder `mathjax` in which the HTML-file is stored the script tag source will be:

```html
  <script type="text/javascript" async
  	src="mathjax/latest.js?config=TeX-MML-AM_CHTML">
  </script>
```

### MarkDown and Katex
The easiest way to export MediaWiki article into MarkDown with mathematical expressions is [KaTeX-Library](http://waylonflinn.github.io/markdown-it-katex/), due to the fact, that [KaTeX](https://khan.github.io/KaTeX/) can render mathematical expressions in LaTeX syntax in the Wiki Markdown. Therefore the mathematical expressions in the wiki article are just wrapped with a dollor symbol and [KaTeX](https://khan.github.io/KaTeX/) will render the syntax in markdown nicely for your output. Therefore a cross-compilation of the latex syntax is not necessary if you use .
* (`INLINE`) inline mathematical expressions are wrapped with TWO Dollar symbols, that replaces the opening and closing `math`-tags.
* (`BLOCK`) separated mathematical block expression are wrapped with a blackslash followed by an opening respectively closing square brackets.
To allow mathematical expression rendering with MathJax
* insert the [MathJax library as script tag in the output HTML file](https://www.mathjax.org/#gettingstarted) (for online use remote CDN - for offline use and integrate MathJax download a [MathJax ZIP copy and unzip on your computer](https://github.com/mathjax/MathJax/archive/master.zip) )  
* replace the opening and closing tags for `INLINE` and `BLOCK` with the following symbols
  * (`INLINE`) inline mathematical expressions are wrapped with ONE Dollar symbol.
  * (`BLOCK`) line separated mathematical block expression are wrapped with TWO Dollar Symbols.
The following latex code shows the converted Wiki markdown text in HTML syntax including the HTML header.
```markdown
This expression $ f(x) $ is a mathematical INLINE expression.
The next line is a BLOCK expression in a separate line.
$$ f(x) $$
This is the text below the BLOCK expression.
```
