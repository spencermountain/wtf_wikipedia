/* eslint-disable no-console */
import makeHeaders from './_headers.js'
import { defaults, toUrlParams, apiBase } from './_fns.js'

const params = {
  format: 'json',
  action: 'query',
  generator: 'random',
  grnnamespace: 14,
  prop: 'revisions',
  grnlimit: 1,
  origin: '*'
}

const randomCategory = function (options = {}, http) {
  options = { ...defaults, ...options }
  let url = apiBase(options)
  url += toUrlParams(params)
  const headers = makeHeaders(options)
  return http(url, headers, options.silent)
    .then((res) => {
      try {
        const o = res.query.pages
        const key = Object.keys(o)[0]
        return o[key].title
      } catch (e) {
        throw e
      }
    })
    .catch((e) => {
      console.error(e)
      return null
    })
}
export default randomCategory
