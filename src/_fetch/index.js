const parseUrl = require('./00-parseUrl')
const makeUrl = require('./01-makeUrl')
const getResult = require('./02-getResult')
const parseDoc = require('./03-parseDoc')
const http = require('./http/server')
const makeHeaders = require('./_headers')
const {isObject} = require('../_lib/helpers')
const isUrl = /^https?:\/\//

/**
 * @typedef fetchDefaults
 * @property {string | undefined} [path]
 * @property {string | undefined} [wiki]
 * @property {string | undefined} [domain]
 * @property {boolean | undefined} [follow_redirects]
 * @property {string | undefined} [lang]
 * @property {string | undefined} [path]
 *
 *
 * @property {string | number | Array<string | number>| undefined} [title]
 *
 * @property {string | undefined} ["Api-User-Agent"]
 */

/**
 *
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
 *  fetches the page from the wiki and returns a Promise with the parsed wikitext
 *
 * @param {string | number | Array<number | string>} title the title, PageID, URL or an array of all three of the page(s) you want to fetch
 * @param {fetchDefaults| function | string} [options] the options for the fetch or the language of the wiki for the article or the callback if you dont provide any options
 * @param {Function | fetchDefaults} [c] the callback function for the call or the options for the fetch
 * @returns {Promise<null | Document | Document[]>}
 */
const fetch = function (title, options, c) {
  let callback = null
  if (typeof options === 'function') {
    callback = options
    options = defaults
  }

  //if the call c is a function then its the callback
  if (typeof c === 'function') {
    callback = c
  }

  //support lang 2nd param
  if (typeof options === 'string') {
    options = Object.assign({}, {lang: options}, isObject(c) ? c : defaults)
  }

  options = options || {}
  options = Object.assign({}, defaults, options)
  options.title = title

  //parse url input
  if (typeof title === 'string' && isUrl.test(title)) {
    options = Object.assign(options, parseUrl(title))
  }

  const url = makeUrl(options)
  const headers = makeHeaders(options)
  return http(url, headers)
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
