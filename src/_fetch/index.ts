import parseUrl from './parseUrl.ts'
import makeUrl from './makeUrl.ts'
import getResult from './getResult.ts'
import parseDoc from './parseDoc.ts'
import makeHeaders from './_headers.ts'
import { isArray } from '../_lib/helpers.ts'
const isUrl = /^https?:\/\//

//the mediawiki api only allows 50 titles or pageids per request
const chunkSize = 50

const defaults = {
  lang: 'en',
  wiki: 'wikipedia',
  domain: undefined,
  follow_redirects: true,
  path: 'api.php', //some 3rd party sites use a weird path
}

const getJson = function (url, headers) {
  return fetch(url, headers).then((res) => {
    if (res.ok !== true) {
      throw new Error(`HTTP ${res.status} error fetching: ${url}`)
    }
    return res.json()
  })
}

//a single pageID, title, or URL returns one Document; an array of pageIDs or
//titles returns an array of Documents. an array must be all pageIDs or all
//titles - the two can't be mixed.
const fetchPage = function (title, options, callback) {
  // support lang as 2nd param
  if (typeof options === 'string') {
    options = { lang: options }
  }
  if (title && typeof title.href === 'string') {
    title = title.href
  }
  options = { ...defaults, ...options }
  options.title = title

  //parse url input
  if (typeof title === 'string' && isUrl.test(title)) {
    options = { ...options, ...parseUrl(title) }
  }
  const headers = makeHeaders(options)

  //split larger requests into groups the api will accept
  let groups = [options.title]
  if (isArray(options.title) && options.title.length > chunkSize) {
    groups = []
    for (let i = 0; i < options.title.length; i += chunkSize) {
      groups.push(options.title.slice(i, i + chunkSize))
    }
  }

  const promise = Promise.resolve()
    .then(() =>
      Promise.all(
        groups.map((group) => {
          const url = makeUrl({ ...options, title: group })
          if (!url) {
            throw new Error(`Could not create a fetch-url from '${title}'`)
          }
          return getJson(url, headers).then((res) => {
            if (!res) {
              throw new Error(`No JSON Data Found For ${url}`)
            }
            return getResult(res, options) || []
          })
        })
      )
    )
    .then((results) => {
      const found = [].concat(...results)
      return parseDoc(found, title)
    })

  if (typeof callback === 'function') {
    return promise.then(
      (data) => callback(null, data),
      (e) => callback(e, null)
    )
  }
  return promise
}
export default fetchPage
