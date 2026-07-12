const open = '{'
const close = '}'

//grab all first-level recursions of '{{...}}'
const findFlat = function (wiki) {
  let depth = 0
  let list = []
  let carry = []
  for (let i = wiki.indexOf(open); i !== -1 && i < wiki.length; depth > 0 ? i++ : (i = wiki.indexOf(open, i + 1))) {
    let c = wiki[i]
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
  return list
}
export default findFlat
