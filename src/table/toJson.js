const encode = require('../_lib/encode');
//
const toJson = function(tables, options) {
  return tables.map((table) => {
    let row = {};
    Object.keys(table).forEach((k) => {
      row[k] = table[k].json(); //(they're sentence objects)
    });
    //encode them, for mongodb
    if (options.encode === true) {
      row = encode.encodeObj(row);
    }
    return row;
  });
};
module.exports = toJson;
