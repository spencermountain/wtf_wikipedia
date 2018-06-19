const smartReplace = require('../../lib/smartReplace');

// create links, bold, italic in html
const doSentence = function(sentence) {
  let text = sentence.text();
  //turn links back into links
  // if (options.links === true) {
  sentence.links().forEach((link) => {
    let href = '';
    let classNames = 'link';
    if (link.site) {
      //use an external link
      href = link.site;
      classNames += ' external';
    } else {
      //otherwise, make it a relative internal link
      href = link.page || link.text;
      href = './' + href.replace(/ /g, '_');
    }
    let tag = '<a class="' + classNames + '" href="' + href + '">';
    tag += link.text + '</a>';
    text = smartReplace(text, link.text, tag);
  });
  // }
  sentence.bold().forEach((str) => {
    let tag = '<b>' + str + '</b>';
    text = smartReplace(text, str, tag);
  });
  sentence.italic().forEach((str) => {
    let tag = '<i>' + str + '</i>';
    text = smartReplace(text, str, tag);
  });

  return '<span class="sentence">' + text + '</span>';
};
module.exports = doSentence;
