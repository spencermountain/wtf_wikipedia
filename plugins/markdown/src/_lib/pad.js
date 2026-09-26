//center-pad each cell, to make the table more legible
const pad = (str, cellWidth) => {
  str ||= ''
  str = String(str)
  cellWidth ||= 15
  let diff = cellWidth - str.length
  diff = Math.ceil(diff / 2)
  for (let i = 0; i < diff; i += 1) {
    str = ' ' + str
    if (str.length < cellWidth) {
      str = str + ' '
    }
  }
  return str
}
export default pad
