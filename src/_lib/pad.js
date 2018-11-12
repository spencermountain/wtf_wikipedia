//center-pad each cell, to make the table more legible
const pad = (str, cellWidth) => {
  str = str || '';
  str = String(str);
  cellWidth = cellWidth || 15;
  let diff = cellWidth - str.length;
  diff = Math.ceil(diff / 2);
  for(let i = 0; i < diff; i += 1) {
    str = ' ' + str;
    if (str.length < cellWidth) {
      str = str + ' ';
    }
  }
  return str;
};
module.exports = pad;
