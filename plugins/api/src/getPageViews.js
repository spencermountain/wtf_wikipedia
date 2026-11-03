import makeHeaders from './_headers.js'
import { normalize, defaults, toUrlParams, apiBase } from './_fns.js'

const params = {
  action: 'query',
  prop: 'pageviews',
  format: 'json',
  origin: '*',
  redirects: true,
}

const makeUrl = function (title, options, append) {
  let url = apiBase(options)
  url += toUrlParams(params)
  url += `&titles=${normalize(title)}`
  if (append) {
    url += append
  }
  return url
}

const getPageViews = function (doc, options, http) {
  options = { ...defaults, ...options }
  const url = makeUrl(doc.title, options)
  const headers = makeHeaders(options)
  return http(url, headers, options.silent).then((res) => {
    const pages = Object.keys(res.query.pages || {})
    if (pages.length === 0) {
      return []
    }
    return res.query.pages[pages[0]].pageviews || []
  })
}
export default getPageViews
