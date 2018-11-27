const getRowSpan = /rowspan=["']([0-9]+)["']/;
// const getColSpan = /colspan=["']([0-9]+)["']/;

// //colspans stretch ←left/right→
// const doColSpan = function(rows) {
//   rows.forEach((row) => {
//     row.forEach((str) => {
//       let m = str.match(getColSpan);
//       if (m !== null) {
//         let num = parseInt(m[1], 10);
//         console.log(num);
//       }
//     });
//   });
//   return rows;
// };

//colspans stretch up/down
const doRowSpan = function(rows) {
  rows.forEach((row, r) => {
    row.forEach((str, c) => {
      let m = str.match(getRowSpan);
      if (m !== null) {
        let num = parseInt(m[1], 10);
        //copy this cell down n rows
        str = str.replace(getRowSpan, '');
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
  // rows = doColSpan(rows);
  return rows;
};
module.exports = handleSpans;
