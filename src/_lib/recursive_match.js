//find all the pairs of '[[...[[..]]...]]' in the text
//used to properly root out recursive template calls, [[.. [[...]] ]]
//basically just adds open tags, and subtracts closing tags
function find_recursive(opener, closer, text) {
  var out = [];
  var last = [];
  const chars = text.split('');
  var open = 0;
  for (var i = 0; i < chars.length; i++) {
    const c = text[i];
    //increment open tag
    if (c === opener) {
      open += 1;
    }
    //decrement close tag
    else if (c === closer) {
      open -= 1;
      if (open < 0) {
        open = 0;
      }
    } else if (last.length === 0) {
      // If we're not inside of a pair of delimiters, we can discard the current letter.
      // The return of this function is only used to extract images.
      continue;
    }

    last.push(c);
    if (open === 0 && last.length > 0) {
      //first, fix botched parse
      var open_count = 0;
      var close_count = 0;
      for (var j = 0; j < last.length; j++) {
        if (last[j] === opener) {
          open_count++;
        } else if (last[j] === closer) {
          close_count++;
        }
      }
      //is it botched?
      if (open_count > close_count) {
        last.push(closer);
      }
      //looks good, keep it
      out.push(last.join(''));
      last = [];
    }
  }
  return out;
}
module.exports = find_recursive;

// console.log(find_recursive('{', '}', 'he is president. {{nowrap|{{small|(1995–present)}}}} he lives in texas'));
// console.log(find_recursive("{", "}", "this is fun {{nowrap{{small1995–present}}}} and it works"))
