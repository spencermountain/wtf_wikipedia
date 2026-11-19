const getRowSpan = /^.*rowspan *= *["']?([0-9]+)["']?[ |]*/m
const getColSpan = /^.*colspan *= *["']?([0-9]+)["']?[ |]*/m

// Every added cell gets parsed, so a table can only grow so far.
// Real colspans stop at about 100, and the most a real table adds is about 50,000 by this count.
const maxColSpan = 200
const maxGrowth = 200000
const emptyCell = 20

// stripping the attributes must not eat a '!' header marker
const stripSpan = function (str, reg) {
  const bang = /^ *!/.test(str) ? '! ' : ''
  return bang + str.replace(reg, '')
}

//colspans stretch ←left/right→
const doColSpan = function (rows, room) {
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
        const extra = Math.min(num - 1, maxColSpan, Math.floor(room.left / emptyCell))
        if (extra > 0) {
          room.left -= extra * emptyCell
          row.splice(c + 1, 0, ...new Array(extra).fill(''))
        }
      }
    })
  })
  rows = rows.filter((r) => r.length > 0)
  return rows
}

//colspans stretch up/down
const doRowSpan = function (rows, room) {
  rows.forEach((row, r) => {
    row.forEach((str, c) => {
      let m = str.match(getRowSpan)
      if (m !== null) {
        let num = parseInt(m[1], 10)
        //copy this cell down n rows
        str = stripSpan(str, getRowSpan)
        row[c] = str
        for (let i = r + 1; i < r + num; i += 1) {
          room.left -= str.length + emptyCell
          if (!rows[i] || room.left < 0) {
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
  const room = { left: maxGrowth }
  rows = doColSpan(rows, room)
  rows = doRowSpan(rows, room)
  return rows
}
export default handleSpans
