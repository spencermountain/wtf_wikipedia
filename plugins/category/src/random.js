const defaults = {
  lang: 'en',
  wiki: 'wikipedia',
  domain: null,
  path: 'w/api.php' //some 3rd party sites use a weird path
}
const isObject = function (obj) {
  return obj && Object.prototype.toString.call(obj) === '[object Object]'
}

const fetchRandom = function (lang, options, http) {
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
  url += `format=json&action=query&generator=random&grnnamespace=14&prop=revisions&grnlimit=1&origin=*`

  return http(url)
    .then((res) => {
      try {
        let o = res.query.pages
        let key = Object.keys(o)[0]
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
module.exports = fetchRandom
