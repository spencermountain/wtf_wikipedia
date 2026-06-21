import unfetch from 'isomorphic-unfetch'
import parseUrl from './parseUrl.js'
import makeUrl from './makeUrl.js'
import getResult from './getResult.js'
import parseDoc from './parseDoc.js'
import makeHeaders from './_headers.js'
const isUrl = /^https?:\/\//

const defaults = {
  lang: 'en',
  wiki: 'wikipedia',
  domain: undefined,
  follow_redirects: true,
  path: 'api.php', //some 3rd party sites use a weird path
}

//a single pageID, title, or URL returns one Document; an array of pageIDs or
//titles returns an array of Documents. an array must be all pageIDs or all
//titles - the two can't be mixed.
const fetch = function (title, options, callback) {
  // support lang as 2nd param
  if (typeof options === 'string') {
    options = { lang: options }
  }
  if (typeof title.href === 'string') {
    title = title.href
  }
  options = { ...defaults, ...options }
  options.title = title

  //parse url input
  if (typeof title === 'string' && isUrl.test(title)) {
    options = { ...options, ...parseUrl(title) }
  }
  const url = makeUrl(options)
  const headers = makeHeaders(options)

  const promise = unfetch(url, headers)
    .then((res) => res.json())
    .then((res) => {
      if (!res) {
        throw new Error(`No JSON Data Found For ${url}`)
      }
      const result = getResult(res, options)
      const data = parseDoc(result, title)
      if (typeof callback === 'function') {
        callback(null, data)
      }
      return data
    })

  return typeof callback === 'function'
    ? promise.catch((e) => callback(e, null))
    : promise
}
export default fetch
