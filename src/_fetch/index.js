const parseUrl = require('./00-parseUrl')
const makeUrl = require('./01-makeUrl')
const getResult = require('./02-getResult')
const parseDoc = require('./03-parseDoc')
const http = require('./http/server')
const makeHeaders = require('./_headers')
const isUrl = /^https?:\/\//

const defaults = {
  lang: 'en',
  wiki: 'wikipedia',
  domain: null,
  follow_redirects: true,
  path: 'api.php', //some 3rd party sites use a weird path
}

const fetch = function (title, options, c) {
  let callback = null
  if (typeof options === 'function') {
    callback = options
    options = {}
  }
  if (typeof c === 'function') {
    callback = c
    c = {}
  }
  //support lang 2nd param
  if (typeof options === 'string') {
    c = c || {}
    options = Object.assign({}, { lang: options }, c)
  }
  options = options || {}
  options = Object.assign({}, defaults, options)
  options.title = title
  // parse url input
  if (isUrl.test(title)) {
    options = Object.assign(options, parseUrl(title))
  }

  const url = makeUrl(options)
  const headers = makeHeaders(options)
  return http(url, headers)
    .then((res) => {
      try {
        let data = getResult(res, options)
        data = parseDoc(data)
        if (callback) {
          callback(null, data)
        }
        return data
      } catch (e) {
        throw e
      }
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
