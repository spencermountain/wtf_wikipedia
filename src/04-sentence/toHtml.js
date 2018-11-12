const smartReplace = require('../_lib/smartReplace');
const helpers = require('../_lib/helpers');
const setDefaults = require('../_lib/setDefaults');

const defaults = {
  links: true,
  formatting: true,
};
// create links, bold, italic in html
const doSentence = function(sentence, options) {
  options = setDefaults(options, defaults);
  let text = sentence.text();
  //turn links into <a href>
  if (options.links === true) {
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
        //add anchor
        if (link.anchor) {
          href += `#${link.anchor}`;
        }
      }
      let str = link.text || link.page;
      let tag = `<a class="${classNames}" href="${href}">${str}</a>`;
      text = smartReplace(text, str, tag);
    });
  }
  if (options.formatting === true) {
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
  }
  return '<span class="sentence">' + text + '</span>';
};
module.exports = doSentence;
