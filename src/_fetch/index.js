const unfetch = require('isomorphic-unfetch')

const parseUrl = require('./parseUrl')
const makeUrl = require('./makeUrl')
const getResult = require('./getResult')
const parseDoc = require('./parseDoc')
const makeHeaders = require('./_headers')
const isUrl = /^https?:\/\//

/**
 * @typedef fetchDefaults
 * @property {string | undefined} [path]
 * @property {string | undefined} [wiki]
 * @property {string | undefined} [domain]
 * @property {boolean | undefined} [follow_redirects]
 * @property {string | undefined} [lang]
 * @property {string | number | Array<string> | Array<number> | undefined} [title]
 * @property {string | undefined} [Api-User-Agent]
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
 * @param {(null | Document | Document[])} response
 */

/**
 *  fetches the page from the wiki and returns a Promise with the parsed wiki text
 *
 * @param {string | number | Array<number> | Array<string>} title the title, PageID, URL or an array of all three of the page(s) you want to fetch
 * @param {fetchDefaults} [options] the options for the fetch or the language of the wiki for the article
 * @param {fetchCallback} [callback] the callback function for the call
 * @returns {Promise<null | Document | Document[]>} either null if the pages is not found, Document if you asked for one result, and a array of Documents if you asked for multiple pages
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
      let data = getResult(res, options)
      data = parseDoc(data)
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
module.exports = fetch
