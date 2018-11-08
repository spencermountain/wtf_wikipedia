const smartReplace = require('../_lib/smartReplace');
const helpers = require('../_lib/helpers');
const setDefaults = require('../_lib/setDefaults');

const defaults = {
  links: true,
  formatting: true,
};
// create links, bold, italic in html
const toLatex = function(sentence, options ) {
  options = setDefaults(options, defaults);
  let text = sentence.plaintext();
  //turn links back into links
  if (options.links === true && sentence.links().length > 0) {
    sentence.links().forEach((link) => {
      let href = '';
      if (link.site) {
        //use an external link
        href = link.site;
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
      let tag = '\\href{' + href + '}{' + str + '}';
      text = smartReplace(text, str, tag);
    });
  }
  if (options.formatting === true) {
    if (sentence.data.fmt) {
      if (sentence.data.fmt.bold) {
        sentence.data.fmt.bold.forEach((str) => {
          let tag = '\\textbf{' + str + '}';
          text = smartReplace(text, str, tag);
        });
      }
      if (sentence.data.fmt.italic) {
        sentence.data.fmt.italic.forEach((str) => {
          let tag = '\\textit{' + str + '}';
          text = smartReplace(text, str, tag);
        });
      }
    }
  }
  return text;
};
module.exports = toLatex;
