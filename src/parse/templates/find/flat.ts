const open = '{'
const close = '}'

// Collect outermost template invocations, tracking individual braces.
const findFlat = (wiki: string) => {
  let depth = 0
  const list = []
  let start = -1
  const len = wiki.length
  for (let i = 0; i < len; i += 1) {
    // Outside an invocation, skip directly to the next opening brace.
    if (depth === 0) {
      i = wiki.indexOf(open, i)
      if (i === -1) {
        break
      }
      start = i
    }
    const c = wiki[i]
    //open it
    if (c === open) {
      depth += 1
    }
    //close it
    if (depth > 0) {
      if (c === close) {
        depth -= 1
        if (depth === 0) {
          const tmpl = wiki.slice(start, i + 1)
          //last check
          if (tmpl.includes('{{') && tmpl.includes('}}')) {
            list.push(tmpl)
          }
          continue
        }
      }
      //require two '{{' to open it
      if (depth === 1 && c !== open && c !== close) {
        depth = 0
        continue
      }
    }
  }
  return list
}
export default findFlat
