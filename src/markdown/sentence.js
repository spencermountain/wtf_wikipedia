
//sometimes text-replacements can be ambiguous
const bestReplace = function(md, text, result) {
  let reg = new RegExp('\\b' + text + '\\b');
  md = md.replace(reg, result);
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
    if (sentence.fmt.bold) {
      sentence.fmt.bold.forEach((b) => {
        console.log(b);
      });
    }
  }
  return md;
};
module.exports = doSentence;
