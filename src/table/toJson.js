import encodeObj from '../_lib/encode.js'

export default function toJson (tables, options = {}) {
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
