const getRowSpan = /rowspan *?= *?["']([0-9]+)["'][ \|]*/;
const getColSpan = /colspan *?= *?["']([0-9]+)["'][ \|]*/;

//colspans stretch ←left/right→
const doColSpan = function(rows) {
  rows.forEach((row) => {
    row.forEach((str, c) => {
      let m = str.match(getColSpan);
      if (m !== null) {
        let num = parseInt(m[1], 10);

        //...maybe if num is so big, and centered, give it a new column? remove it?

        //splice-in n empty columns right here
        row[c] = str.replace(getColSpan, '');
        for(let i = 1; i < num; i += 1) {
          row.splice(c + 1, 0, '');
        }
      }
    });
  });
  return rows;
};

//colspans stretch up/down
const doRowSpan = function(rows) {
  rows.forEach((row, r) => {
    row.forEach((str, c) => {
      let m = str.match(getRowSpan);
      if (m !== null) {
        let num = parseInt(m[1], 10);
        //copy this cell down n rows
        str = str.replace(getRowSpan, '');
        row[c] = str;
        for(let i = r + 1; i < r + num; i += 1) {
          if (!rows[i]) {
            break;
          }
          rows[i].splice(c, 0, str);
        }
      }
    });
  });
  return rows;
};

//
const handleSpans = function(rows) {
  rows = doRowSpan(rows);
  rows = doColSpan(rows);
  return rows;
};
module.exports = handleSpans;
