const opener = '['
const closer = ']'

//find all the pairs of '[[...[[..]]...]]' in the text
//used to root out recursive template calls, [[.. [[...]] ]]
//basically just adds open tags, and subtracts closing tags
function nested_find(text: string) {
  const out = []
  let open = 0
  let start = -1
  let openCount = 0
  let closeCount = 0
  const len = text.length
  for (let i = 0; i < len; i++) {
    //If we're not inside of a pair of delimiters, skip ahead to the next opener.
    if (start === -1) {
      i = text.indexOf(opener, i)
      if (i === -1) {
        break
      }
    }
    const c = text[i]
    if (c === opener) {
      if (start === -1) {
        start = i
        openCount = 0
        closeCount = 0
      }
      open += 1
      openCount += 1
    } else if (c === closer) {
      open -= 1
      if (open < 0) {
        open = 0
      }
      closeCount += 1
    }
    if (open === 0 && start !== -1) {
      let found = text.slice(start, i + 1)
      //fix botched parse
      if (openCount > closeCount) {
        found += closer
      }
      out.push(found)
      start = -1
    }
  }
  return out
}

export default nested_find
