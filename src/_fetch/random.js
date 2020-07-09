const http = require('./http/server')
const makeHeaders = require('./_headers')
const getResult = require('./02-getResult')
const parseDoc = require('./03-parseDoc')

const defaults = {
  lang: 'en',
  wiki: 'wikipedia',
  domain: null,
  path: 'w/api.php', //some 3rd party sites use a weird path
}
const isObject = function (obj) {
  return obj && Object.prototype.toString.call(obj) === '[object Object]'
}

const fetchRandom = function (lang, options) {
  options = options || {}
  options = Object.assign({}, defaults, options)
  //support lang 2nd param
  if (typeof lang === 'string') {
    options.lang = lang
  } else if (isObject(lang)) {
    options = Object.assign(options, lang)
  }

  let url = `https://${options.lang}.wikipedia.org/${options.path}?`
  if (options.domain) {
    url = `https://${options.domain}/${options.path}?`
  }
  url += `format=json&action=query&generator=random&grnnamespace=0&prop=revisions|pageprops&rvprop=content&grnlimit=1&rvslots=main&origin=*`

  const headers = makeHeaders(options)
  return http(url, headers)
    .then((res) => {
      try {
        let data = getResult(res)
        return parseDoc(data)
      } catch (e) {
        throw e
      }
    })
    .catch((e) => {
      console.error(e)
      return null
    })
}
module.exports = fetchRandom
