const isHeading = /^!/

// Remove standalone section headings that do not span multiple rows.
const removeMidSpans = function (rows) {
  if (rows.every((row) => row.length === 1)) {
    return rows
  }
  rows = rows.filter((row) => {
    if (row.length === 1 && row[0] && isHeading.test(row[0]) && /rowspan/i.test(row[0]) === false) {
      return false
    }
    return true
  })
  return rows
}

export default removeMidSpans
