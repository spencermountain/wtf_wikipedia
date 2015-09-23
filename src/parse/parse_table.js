var helpers = require("../lib/helpers");
//turn a {|...table string into an array of arrays
var parse_table = function (wiki) {
  var table = [];
  var lines = wiki.replace(/\r/g, '').split(/\n/);
  lines.forEach(function (str) {
    //die
    if(str.match(/^\|\}/)) {
      return
    }
    //make new row
    if(str.match(/^\|-/)) {
      table.push([]);
      return
    }
    //this is some kind of comment
    if(str.match(/^\|\+/)) {
      return
    }
    //juicy line
    if(str.match(/^[\!\|]/)) {
      //make a new row
      if(!table[table.length - 1]) {
        table[table.length - 1] = []
      }
      var want = (str.match(/\|(.*)/) || [])[1] || '';
      want = helpers.trim_whitespace(want) || '';
        //handle the || shorthand..
      if(want.match(/[!\|]{2}/)) {
        want.split(/[!\|]{2}/g).forEach(function (s) {
          s = helpers.trim_whitespace(s);
          table[table.length - 1].push(s)
        })
      } else {
        table[table.length - 1].push(want)
      }
    }
  });
  return table
};
module.exports = parse_table;
