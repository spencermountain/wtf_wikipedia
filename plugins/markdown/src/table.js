import pad from './_lib/pad.js'
/* this is a markdown table:
| Tables        | Are           | Cool  |
| ------------- |:-------------:| -----:|
| col 3 is      | right-aligned | $1600 |
| col 2 is      | centered      |   $12 |
| zebra stripes | are neat      |    $1 |
*/

const makeRow = (arr) => {
  arr = arr.map((s) => pad(s, 14))
  return '| ' + arr.join(' | ') + ' |'
}

//markdown tables are weird
const doTable = function (Sentence, options) {
  let md = ''
  if (!this || this.length === 0) {
    return md
  }
  const rows = this.json().rows
  if (rows.length === 0) {
    return ''
  }
  const keys = Object.keys(rows[0])
  const blocks = this.headers()
  const headers = keys.map((_key, i) => {
    return blocks[i] ? new Sentence(blocks[i].json('xl')).markdown(options) : ''
  })
  //draw the header (necessary!)
  md += makeRow(headers) + '\n'
  md += makeRow(headers.map(() => '---')) + '\n'
  //do each row..
  md += rows
    .map((row) => {
      //each column..
      const arr = keys.map((k) => {
        if (!row[k]) {
          return ''
        }
        return new Sentence(row[k]).markdown(options) || ''
      })
      //make it a nice padded row
      return makeRow(arr)
    })
    .join('\n')
  return md + '\n'
}
export default doTable
