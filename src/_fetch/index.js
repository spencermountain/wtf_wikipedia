/* eslint-disable no-console */
import unfetch from 'isomorphic-unfetch'
import parseUrl from './parseUrl.js'
import makeUrl from './makeUrl.js'
import getResult from './getResult.js'
import parseDoc from './parseDoc.js'
import makeHeaders from './_headers.js'
const isUrl = /^https?:\/\//

/**
 * @typedef fetchDefaults
 * @property {string | undefined} [path] the path to the wiki api. default: api.php
 * @property {string | undefined} [wiki]
 * @property {string | undefined} [domain] the domain of the wiki you want to query
 * @property {boolean | undefined} [follow_redirects] should the library follow redirects
 * @property {string | undefined} [lang] the language of the wiki
 * @property {string | number | Array<string> | Array<number> | undefined} [title]
 * @property {string | undefined} [Api-User-Agent] the user agent of the application
 * @property {string | undefined} [origin] the domain or the origin of the request
 */

/**
 * @type {fetchDefaults}
 */
const defaults = {
  lang: 'en',
  wiki: 'wikipedia',
  domain: undefined,
  follow_redirects: true,
  path: 'api.php', //some 3rd party sites use a weird path
}

/**
 * @callback fetchCallback
 * @param {Object} error
 * @param {any} result
 */

/**
 *  fetches the page from the wiki and returns a Promise with the parsed wiki text
 *
 * if you supply it with a single pageID or title it will return a Document object.
 * if you supply a wiki URL then we will parse it and use the tile and provide a single Document object
 * if you supply it with an array with pageIDs or an array of titles it will return an array of document objects.
 *
 * there is another catch in the programming you need if you provide an array it needs to be eighter pageIDs or titles they can not be mixed.
 *
 * @param {string | number | Array<number> | Array<string>} title the title, PageID, URL or an array of all three of the page(s) you want to fetch
 * @param {fetchDefaults} [options] the options for the fetch or the language of the wiki for the article
 * @param {fetchCallback} [callback] the callback function for the call
 */
const fetch = function (title, options, callback) {
  // support lang as 2nd param
  if (typeof options === 'string') {
    options = { lang: options }
  }
  options = { ...defaults, ...options }
  options.title = title

  //parse url input
  if (typeof title === 'string' && isUrl.test(title)) {
    options = { ...options, ...parseUrl(title) }
  }
  const url = makeUrl(options)
  const headers = makeHeaders(options)

  return unfetch(url, headers)
    .then((res) => res.json())
    .then((res) => {
      if (!res) {
        throw new Error(`No JSON Data Found For ${url}`)
      }
      let data = getResult(res, options)
      data = parseDoc(data, title)
      if (callback) {
        callback(null, data)
      }
      return data
    })
    .catch((e) => {
      console.error(e)
      if (callback) {
        callback(e, null)
      }
      return null
    })
}
export default fetch
