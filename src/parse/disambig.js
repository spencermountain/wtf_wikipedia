const parse_links = require('./text/links');

//return a list of probable pages for this disambig page
const parse_disambig = function(wiki) {
  let pages = [];
  let lines = wiki.replace(/\r/g, '').split(/\n/);
  lines.forEach(function(str) {
    //if there's an early link in the list
    if (str.match(/^\*.{0,40}\[\[.*\]\]/)) {
      let links = parse_links(str);
      if (links && links[0] && links[0].page) {
        pages.push(links[0].page);
      }
    }
  });
  return {
    type: 'disambiguation',
    pages: pages
  };
};
module.exports = parse_disambig;
