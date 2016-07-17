//find all the pairs of '[[...[[..]]...]]' in the text
//used to properly root out recursive template calls, [[.. [[...]] ]]
//basically just adds open tags, and subtracts closing tags
function recursive_matches(opener, closer, text) {
  var out = [];
  var last = [];
  var chars = text.split('');
  var open = 0;
  for (var i = 0; i < chars.length; i++) {
    //incriment open tag
    if (chars[i] === opener) {
      open += 1
    }
    //decrement close tag
    if (chars[i] === closer) {
      open -= 1;
      if (open < 0) {
        open = 0
      }
    }
    if (open >= 0) {
      last.push(chars[i])
    }
    if (open === 0 && last.length > 0) {
      //first, fix botched parse
      var open_count = last.filter(function(s) {
        return s === opener
      });
      var close_count = last.filter(function(s) {
        return s === closer
      });
      //is it botched?
      if (open_count.length > close_count.length) {
        last.push(closer)
      }
      //looks good, keep it
      out.push(last.join(''));
      last = []
    }
  }
  return out
}
module.exports = recursive_matches;

// console.log(recursive_matches("{", "}", "he is president. {{nowrap|{{small|(1995–present)}}}} he lives in texas"))
// console.log(recursive_matches("{", "}", "this is fun {{nowrap{{small1995–present}}}} and it works"))
