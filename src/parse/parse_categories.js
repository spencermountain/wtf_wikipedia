var i18n = require("../data/i18n");

function parse_categories(wiki) {
  var cats = [];
  var reg = new RegExp("\\[\\[:?(" + i18n.categories.join("|") + "):(.{2,60}?)\]\](\w{0,10})", "ig");
  var tmp = wiki.match(reg); //regular links
  if (tmp) {
    var reg2 = new RegExp("^\\[\\[:?(" + i18n.categories.join("|") + "):", "ig");
    tmp.forEach(function(c) {
      c = c.replace(reg2, "");
      c = c.replace(/\|?[ \*]?\]\]$/i, ""); //parse fancy onces..
      c = c.replace(/\|.*/, ""); //everything after the '|' is metadata
      if (c && !c.match(/[\[\]]/)) {
        cats.push(c);
      }
    });
  }
  return cats;
}
module.exports = parse_categories;
