const helpers = require("../../lib/helpers");
const parse_links = require("./links");
const i18n = require("../../data/i18n");
const cat_reg = new RegExp("\\[\\[:?(" + i18n.categories.join("|") + "):[^\\]\\]]{2,80}\\]\\]", "gi");

//return only rendered text of wiki links
const resolve_links = function(line) {
  // categories, images, files
  line = line.replace(cat_reg, "");
  // [[Common links]]
  line = line.replace(/\[\[:?([^|]{2,80}?)\]\](\w{0,5})/g, "$1$2");
  // [[File:with|Size]]
  line = line.replace(/\[\[File:?(.{2,80}?)\|([^\]]+?)\]\](\w{0,5})/g, "$1");
  // [[Replaced|Links]]
  line = line.replace(/\[\[:?(.{2,80}?)\|([^\]]+?)\]\](\w{0,5})/g, "$2$3");
  // External links
  line = line.replace(/\[(https?|news|ftp|mailto|gopher|irc):\/\/[^\]\| ]{4,1500}([\| ].*?)?\]/g, "$2");
  return line;
};
// console.log(resolve_links("[http://www.whistler.ca www.whistler.ca]"))

function postprocess(line) {
  //fix links
  line = resolve_links(line);
  //oops, recursive image bug
  if (line.match(/^(thumb|right|left)\|/i)) {
    return null;
  }
  line = helpers.trim_whitespace(line);
  return line;
}

function parse_line(line) {
  let obj = {
    text: postprocess(line)
  };
  let links = parse_links(line);
  if (links) {
    obj.links = links;
  }
  return obj;
}

module.exports = parse_line;
