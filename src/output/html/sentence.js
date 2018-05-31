const smartReplace = require('../../lib/smartReplace');
const helpers = require('../../lib/helpers');

// create links, bold, italic in html
const doSentence = function(sentence) {
  let text = sentence.text();
  //turn links into <a href>
  sentence.links().forEach((link) => {
    let href = '';
    let classNames = 'link';
    if (link.site) {
      //use an external link
      href = link.site;
      classNames += ' external';
    } else {
      //otherwise, make it a relative internal link
      href = helpers.capitalise(link.page);
      href = './' + href.replace(/ /g, '_');
    }
    let str = link.text || link.page;
    let tag = `<a class="${classNames}" href="${href}">${str}</a>`;
    text = smartReplace(text, str, tag);
  });
  //support bolds
  sentence.bold().forEach((str) => {
    let tag = '<b>' + str + '</b>';
    text = smartReplace(text, str, tag);
  });
  //do italics
  sentence.italic().forEach((str) => {
    let tag = '<i>' + str + '</i>';
    text = smartReplace(text, str, tag);
  });

  return '<span class="sentence">' + text + '</span>';
};
module.exports = doSentence;
