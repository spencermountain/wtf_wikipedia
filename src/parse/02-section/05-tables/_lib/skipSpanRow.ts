const skipSpanRow = function (row) {
  row ||= []
  let len = row.length
  let hasTxt = row.filter((str) => str).length
  // Skip rows with more than three empty cells.
  if (len - hasTxt > 3) {
    return true
  }
  return false
}

export default skipSpanRow
