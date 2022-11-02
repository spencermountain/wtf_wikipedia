import pad from './_lib/pad.js'
/* this is a markdown table:
| Tables        | Are           | Cool  |
| ------------- |:-------------:| -----:|
| col 3 is      | right-aligned | $1600 |
| col 2 is      | centered      |   $12 |
| zebra stripes | are neat      |    $1 |
*/

function makeRow (arr) {
  arr = arr.map((s) => pad(s, 14))
  return '| ' + arr.join(' | ') + ' |'
}

//markdown tables are weird
function doTable (options) {
  let md = ''
  if (!this || this.length === 0) {
    return md
  }
  let rows = this.data
  let keys = Object.keys(rows[0])
  //first, grab the headers
  //remove auto-generated number keys
  let headers = keys.map((k) => {
    if (/^col[0-9]/.test(k) === true) {
      return ''
    }
    return k
  })
  //draw the header (necessary!)
  md += makeRow(headers) + '\n'
  md += makeRow(headers.map(() => '---')) + '\n'
  //do each row..
  md += rows
    .map((row) => {
      //each column..
      let arr = keys.map((k) => {
        if (!row[k]) {
          return ''
        }
        return row[k].markdown(options) || ''
      })
      //make it a nice padded row
      return makeRow(arr)
    })
    .join('\n')
  return md + '\n'
}
export default doTable
