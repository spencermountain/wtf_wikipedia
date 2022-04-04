const opener = '['
const closer = ']'

/**
 *
 * find all the pairs of '[[...[[..]]...]]' in the text
 * used to properly root out recursive template calls, [[.. [[...]] ]]
 * basically just adds open tags, and subtracts closing tags
 *
 * @private
 * @param {string} text the text in which is searched in
 * @returns {string[]} all the links in the text
 */
function nested_find(text) {
  let out = []
  let last = []
  const chars = text.split('')
  let open = 0
  for (let i = 0; i < chars.length; i++) {
    const c = text[i]
    //increment open tag
    if (c === opener) {
      open += 1
    }
    //decrement close tag
    else if (c === closer) {
      open -= 1
      if (open < 0) {
        open = 0
      }
    } else if (last.length === 0) {
      //If we're not inside of a pair of delimiters, we can discard the current letter.
      //The return of this function is only used to extract images.
      continue
    }

    last.push(c)
    if (open === 0 && last.length > 0) {
      //first, fix botched parse
      let open_count = 0
      let close_count = 0
      for (let j = 0; j < last.length; j++) {
        if (last[j] === opener) {
          open_count++
        } else if (last[j] === closer) {
          close_count++
        }
      }
      //is it botched?
      if (open_count > close_count) {
        last.push(closer)
      }
      //looks good, keep it
      out.push(last.join(''))
      last = []
    }
  }
  return out
}

export default nested_find
