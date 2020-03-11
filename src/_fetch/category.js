const http = require('./http/server')
const makeHeaders = require('./_headers')

const defaults = {
  lang: 'en',
  wiki: 'wikipedia',
  domain: null,
  path: 'w/api.php' //some 3rd party sites use a weird path
}

const normalizeCategory = function(cat = '') {
  if (/^Category/i.test(cat) === false) {
    cat = 'Category:' + cat
  }
  cat = cat.replace(/ /g, '_')
  return cat
}

const isObject = function(obj) {
  return obj && Object.prototype.toString.call(obj) === '[object Object]'
}

const getResult = function(body) {
  let list = body.query.categorymembers || []
  let res = {
    pages: [],
    categories: []
  }
  list.forEach(p => {
    if (p.ns === 14) {
      delete p.ns
      res.categories.push(p)
    } else {
      delete p.ns
      res.pages.push(p)
    }
  })
  return res
}

const makeUrl = function(category, options, cm) {
  category = normalizeCategory(category)
  category = encodeURIComponent(category)
  let url = `https://${options.lang}.wikipedia.org/${options.path}?`
  if (options.domain) {
    url = `https://${options.domain}/${options.path}?`
  }
  url += `action=query&list=categorymembers&cmtitle=${category}&cmlimit=500&format=json&origin=*&redirects=true&cmtype=page|subcat`
  if (cm) {
    url += '&cmcontinue=' + cm
  }
  return url
}

const fetchCategory = function(category, lang, options) {
  options = options || {}
  options = Object.assign({}, defaults, options)
  //support lang 2nd param
  if (typeof lang === 'string') {
    options.lang = lang
  } else if (isObject(lang)) {
    options = Object.assign(options, lang)
  }
  let res = {
    pages: [],
    categories: []
  }
  // wrap a promise around potentially-many requests
  return new Promise((resolve, reject) => {
    const doit = function(cm) {
      let url = makeUrl(category, options, cm)
      const headers = makeHeaders(options)
      return http(url, headers)
        .then(body => {
          res = getResult(body, res)
          if (body.continue && body.continue.cmcontinue) {
            doit(body.continue.cmcontinue)
          } else {
            resolve(res)
          }
        })
        .catch(e => {
          console.error(e)
          reject(e)
        })
    }
    doit(null)
  })
}

module.exports = fetchCategory
