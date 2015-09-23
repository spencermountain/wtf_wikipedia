var helpers = require("../lib/helpers");
var parse_links = require("./parse_links");
var i18n = require("../data/i18n");

//return only rendered text of wiki links
function resolve_links(line) {
  // categories, images, files
  var re = new RegExp("\\[\\[:?(" + i18n.categories.join("|") + "):[^\\]\\]]{2,80}\\]\\]", "gi");
  line = line.replace(re, "");

  // [[Common links]]
  line = line.replace(/\[\[:?([^|]{2,80}?)\]\](\w{0,5})/g, "$1$2");
  // [[Replaced|Links]]
  line = line.replace(/\[\[:?(.{2,80}?)\|([^\]]+?)\]\](\w{0,5})/g, "$2$3");
  // External links
  line = line.replace(/\[(https?|news|ftp|mailto|gopher|irc):\/\/[^\]\| ]{4,1500}([\| ].*?)?\]/g, "$2");
  return line;
}
// console.log(resolve_links("[http://www.whistler.ca www.whistler.ca]"))

function postprocess(line) {

  //fix links
  line = resolve_links(line);
  //oops, recursive image bug
  if (line.match(/^(thumb|right|left)\|/i)) {
    return null;
  }
  //some IPA pronounciations leave blank junk parenteses
  line = line.replace(/\([^a-z]{0,8}\)/, "");
  line = helpers.trim_whitespace(line);

  // put new lines back in
  // line=line+"\n";

  return line;
}

function parse_line(line) {
  return {
    text: postprocess(line),
    links: parse_links(line)
  };
}

// console.log(fetch_links("it is [[Tony Hawk|Tony]]s moher in [[Toronto]]s"))
module.exports = parse_line;
