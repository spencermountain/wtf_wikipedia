const smartReplace = require('../lib').smartReplace;

// create links, bold, italic in html
const doSentence = function(sentence, options) {
  let text = sentence.text;
  //turn links back into links
  if (sentence.links && options.links === true) {
    sentence.links.forEach((link) => {
      let href = '';
      let classNames = 'link';
      if (link.site) {
        //use an external link
        href = link.site;
        link += ' external';
      } else {
        //otherwise, make it a relative internal link
        href = link.page || link.text;
        href = './' + href.replace(/ /g, '_');
      }
      let tag = '<a class="' + classNames + '" href="' + href + '">';
      tag += link.text + '</a>';
      text = smartReplace(text, link.text, tag);
    });
  }
  return text;
};
module.exports = doSentence;
