const getRowSpan = /^.*rowspan *= *["']?([0-9]+)["']?[ |]*/m
const getColSpan = /^.*colspan *= *["']?([0-9]+)["']?[ |]*/m

// stripping the attributes must not eat a '!' header marker
const stripSpan = function (str, reg) {
  const bang = /^ *!/.test(str) ? '! ' : ''
  return bang + str.replace(reg, '')
}

//colspans stretch ←left/right→
const doColSpan = function (rows) {
  rows.forEach((row) => {
    row.forEach((str, c) => {
      let m = str.match(getColSpan)
      if (m !== null) {
        let num = parseInt(m[1], 10)

        //...maybe if num is so big, and centered, remove it?
        // if (num > 3) {
        //   rows[r] = []
        //   return
        // }
        //splice-in n empty columns right here
        row[c] = stripSpan(str, getColSpan)
        for (let i = 1; i < num; i += 1) {
          row.splice(c + 1, 0, '')
        }
      }
    })
  })
  rows = rows.filter((r) => r.length > 0)
  return rows
}

//colspans stretch up/down
const doRowSpan = function (rows) {
  rows.forEach((row, r) => {
    row.forEach((str, c) => {
      let m = str.match(getRowSpan)
      if (m !== null) {
        let num = parseInt(m[1], 10)
        //copy this cell down n rows
        str = stripSpan(str, getRowSpan)
        row[c] = str
        for (let i = r + 1; i < r + num; i += 1) {
          if (!rows[i]) {
            break
          }
          rows[i].splice(c, 0, str)
        }
      }
    })
  })
  return rows
}

//
const handleSpans = function (rows) {
  rows = doColSpan(rows)
  rows = doRowSpan(rows)
  return rows
}
export default handleSpans
