import findHeaders from './_lib/findHeaders.ts'
import firstRowHeader from './_lib/firstRowHeader.ts'

const extractHeaders = (rows, opts) => {
  let headers = findHeaders(rows, opts)
  if (!headers || headers.length <= 1) {
    headers = firstRowHeader(rows, opts)
    let want = rows.at(-1) || []
    //try the second row
    if (headers.length <= 1 && want.length > 2) {
      headers = firstRowHeader(rows.slice(1), opts)
      if (headers.length > 0) {
        rows = rows.slice(2) //remove them
      }
    }
  }
  return { headers, rows }
}

export default extractHeaders
