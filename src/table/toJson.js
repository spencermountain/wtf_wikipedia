import encodeObj from '../_lib/encode.js'
//
const toJson = function (tables, options) {
  return tables.map((table) => {
    let row = {}
    Object.keys(table).forEach((k) => {
      row[k] = table[k].json() //(they're sentence objects)
    })
    //encode them, for mongodb
    if (options.encode === true) {
      row = encodeObj(row)
    }
    return row
  })
}
export default toJson
