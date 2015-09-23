var helpers = require("../lib/helpers");
var parse_line = require("./parse_line");

function parse_infobox(str) {
  var obj = {};
  if(str) {
    //this collapsible list stuff is just a headache
    str = str.replace(/\{\{Collapsible list[^\}]{10,1000}\}\}/g, '');
    str.replace(/\r/g, '').split(/\n/).forEach(function (l) {
      if(l.match(/^\|/)) {
        var key = l.match(/^\| ?(.{1,200}?)[ =]/) || [];
        key = helpers.trim_whitespace(key[1] || '');
        var value = l.match(/=(.{1,500})$/) || [];
        value = helpers.trim_whitespace(value[1] || '');
        //this is necessary for mongodb, im sorry
        if(key && key.match(/[\.]/)) {
          key = null;
        }
        if(key && value && !value.match(/^[\|<]/) && !value.match(/=/)) {
          obj[key] = parse_line(value);
            //turn number strings into integers
          if(obj[key].text && obj[key].text.match(/^[0-9,]*$/)) {
            obj[key].text = obj[key].text.replace(/,/g);
            obj[key].text = parseInt(obj[key].text, 10);
          }
        }
      }
    })
  }
  return obj
}
module.exports = parse_infobox;
