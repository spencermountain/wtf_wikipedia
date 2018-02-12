
//sometimes text-replacements can be ambiguous - words used multiple times..
const bestReplace = function(md, text, result) {
  //try a word-boundary replace
  let reg = new RegExp('\\b' + text + '\\b');
  if (reg.test(md) === true) {
    md = md.replace(reg, result);
  } else {
    //otherwise, fall-back to a much messier, dangerous replacement
    console.warn('missing \'' + text + '\'');
  // md = md.replace(text, result);
  }
  return md;
};

// add `[text](href)` to the text
const doLink = function(md, link) {
  let href = '';
  //if it's an external link, we good
  if (link.site) {
    href = link.site;
  } else {
    //otherwise, make it a relative internal link
    href = link.page || link.text;
    href = './' + href.replace(/ /g, '_');
  }
  let mdLink = '[' + link.text + '](' + href + ')';
  md = bestReplace(md, link.text, mdLink);
  return md;
};

//create links, bold, italic in markdown
const doSentence = (sentence, options) => {
  let md = sentence.text;
  //turn links back into links
  if (sentence.links && options.links === true) {
    sentence.links.forEach((link) => {
      md = doLink(md, link);
    });
  }
  //turn bolds into **bold**
  if (sentence.fmt.bold) {
    sentence.fmt.bold.forEach((b) => {
      md = bestReplace(md, b, '**' + b + '**');
    });
  }
  //support *italics*
  if (sentence.fmt.italic) {
    sentence.fmt.italic.forEach((i) => {
      md = bestReplace(md, i, '*' + i + '*');
    });
  }
  return md;
};
module.exports = doSentence;
