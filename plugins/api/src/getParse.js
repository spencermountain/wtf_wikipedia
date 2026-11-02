import { normalize, defaults, toUrlParams, apiBase } from './_fns.js'
import makeHeaders from './_headers.js'

// the api's parse endpoint renders one page server-side
const params = {
  action: 'parse',
  redirects: '1',
  format: 'json',
  formatversion: '2',
  origin: '*',
}

const makeUrl = function (title, options, prop) {
  let url = apiBase(options)
  url += toUrlParams({ ...params, prop })
  url += `&page=${normalize(title)}`
  return url
}

// prop is 'text' for rendered html, or 'wikitext' for the raw markup
const getParse = function (title, options, http, prop) {
  options = { ...defaults, ...options }
  const url = makeUrl(title, options, prop)
  const headers = makeHeaders(options)
  return http(url, headers).then((res) => {
    return res?.parse?.[prop] ?? null
  })
}
export default getParse
