//remove top-bottoms
const cleanup = function (lines) {
  lines = lines.filter((line) => {
    //a '|+' row is a 'table caption', remove it.
    return line && /^\|\+/.test(line) !== true
  })
  if (/^\{\|/.test(lines[0]) === true) {
    lines.shift()
  }
  if (/^\|\}/.test(lines[lines.length - 1]) === true) {
    lines.pop()
  }
  if (/^\|-/.test(lines[0]) === true) {
    lines.shift()
  }
  return lines
}

//turn newline seperated into '|-' seperated
const findRows = function (lines) {
  let rows = []
  let row = []
  lines = cleanup(lines)
  for (let i = 0; i < lines.length; i += 1) {
    let line = lines[i]
    //'|-' is a row-seperator
    if (/^\|-/.test(line) === true) {
      //okay, we're done the row
      if (row.length > 0) {
        rows.push(row)
        row = []
      }
    } else {
      // remove leading | or ! for the ||/!! splitting
      let startChar = line.charAt(0)
      if (startChar === '|' || startChar === '!') {
        line = line.substring(1)
      }
      //look for '||' inline row-splitter
      line = line.split(/(?:\|\||!!)/) //eslint-disable-line
      // add leading ! back, because we later read it in header parsing functions
      if (startChar === '!') {
        line[0] = startChar + line[0]
      }
      line.forEach((l) => {
        l = l.trim()
        row.push(l)
      })
    }
  }
  //finish the last one
  if (row.length > 0) {
    rows.push(row)
  }
  return rows
}
export default findRows
