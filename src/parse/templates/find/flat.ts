const open = '{'
const close = '}'

// Collect outermost template invocations, tracking individual braces.
const findFlat = (wiki: string) => {
  let depth = 0
  let list = []
  let carry = []
  for (let i = 0; i < wiki.length; i += 1) {
    // Outside an invocation, skip directly to the next opening brace.
    if (depth === 0) {
      i = wiki.indexOf(open, i)
      if (i === -1) {
        break
      }
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
          carry.push(c)
          let tmpl = carry.join('')
          carry = []
          //last check
          if (/\{\{/.test(tmpl) && /\}\}/.test(tmpl)) {
            list.push(tmpl)
          }
          continue
        }
      }
      //require two '{{' to open it
      if (depth === 1 && c !== open && c !== close) {
        depth = 0
        carry = []
        continue
      }
      carry.push(c)
    }
  }
  // console.log(list)
  return list
}
export default findFlat
