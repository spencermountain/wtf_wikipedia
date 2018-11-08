const smartReplace = require('../_lib/smartReplace');
const helpers = require('../_lib/helpers');
const setDefaults = require('../_lib/setDefaults');

const defaults = {
  links: true,
  formatting: true,
};
// add `[text](href)` to the text
const doLink = function(md, link) {
  let href = '';
  //if it's an external link, we good
  if (link.site) {
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
  let mdLink = '[' + str + '](' + href + ')';
  md = smartReplace(md, str, mdLink);
  return md;
};

//create links, bold, italic in markdown
const toMarkdown = (sentence, options) => {
  options = setDefaults(options, defaults);
  let md = sentence.text();
  //turn links back into links
  if (options.links === true) {
    sentence.links().forEach((link) => {
      md = doLink(md, link);
    });
  }
  //turn bolds into **bold**
  if (options.formatting === true) {
    sentence.bold().forEach((b) => {
      md = smartReplace(md, b, '**' + b + '**');
    });
    //support *italics*
    sentence.italic().forEach((i) => {
      md = smartReplace(md, i, '*' + i + '*');
    });
  }
  return md;
};
module.exports = toMarkdown;
