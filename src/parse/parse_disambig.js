var parse_links = require("./parse_links");

//return a list of probable pages for this disambig page
var parse_disambig = function (wiki) {
  var pages = [];
  var lines = wiki.replace(/\r/g, '').split(/\n/);
  lines.forEach(function (str) {
    //if there's an early link in the list
    if(str.match(/^\*.{0,40}\[\[.*\]\]/)) {
      var links = parse_links(str);
      if(links && links[0] && links[0].page) {
        pages.push(links[0].page);
      }
    }
  });
  return {
    type: "disambiguation",
    pages: pages
  }
};
module.exports = parse_disambig;
