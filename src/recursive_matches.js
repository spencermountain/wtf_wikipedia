//find all the pairs of '[[...[[..]]...]]' in the text
//used to properly root out recursive template calls, [[.. [[...]] ]]
function recursive_matches(opener, closer, text) {
  var out = [];
  var last = [];
  var chars = text.split('');
  var open = 0;
  for(var i = 0; i < chars.length; i++) {
    if(chars[i] === opener && chars[i + 1] && chars[i + 1] === opener) {
      open += 1
    }
    if(open >= 0) {
      last.push(chars[i])
    }
    if(open <= 0 && last.length > 0) {
      //first, fix botched parse
      var open_count = last.filter(function (s) {
        return s === opener
      });
      var close_count = last.filter(function (s) {
        return s === closer
      });
      if(open_count.length > close_count.length) {
        last.push(closer)
      }
      out.push(last.join(''));
      last = []
    }
    if(chars[i] === closer && chars[i + 1] && chars[i + 1] === closer) { //this introduces a bug for "...]]]]"
      open -= 1;
      if(open < 0) {
        open = 0
      }
    }
  }
  return out
}
module.exports = recursive_matches;
