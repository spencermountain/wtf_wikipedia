const cellWidth = 15;
//center-pad each cell, to make the table more legible
const pad = (str) => {
  str = str || '';
  let diff = cellWidth - str.length;
  diff = parseInt(diff / 2, 10);
  for(let i = 0; i < diff; i += 1) {
    str = ' ' + str + ' ';
  }
  return str;
};
module.exports = pad;
