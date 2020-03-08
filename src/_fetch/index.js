const parseUrl = require('./00-parseUrl')
const makeUrl = require('./01-makeUrl')
const getResult = require('./02-getResult')
const parseDoc = require('./03-parseDoc')
const http = require('./http/server')
const isUrl = /^https?:\/\//

const defaults = {
  lang: 'en',
  wiki: 'wikipedia',
  domain: null,
  follow_redirects: true,
  path: 'api.php' //some 3rd party sites use a weird path
}

const makeHeaders = function(options) {
  let agent =
    options.userAgent ||
    options['User-Agent'] ||
    options['Api-User-Agent'] ||
    'User of the wtf_wikipedia library'

  const opts = {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Api-User-Agent': agent,
      'User-Agent': agent,
      Origin: '*'
    },
    redirect: 'follow'
  }
  return opts
}

const fetch = function(title, options, c) {
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
    .then(res => {
      try {
        let data = getResult(res)
        return parseDoc(data)
      } catch (e) {
        throw e
      }
    })
    .catch(e => {
      console.error(e)
      return null
    })
}
module.exports = fetch

// console.log(fetch(`? (Enuff Z'nuff album)`))
// console.log(fetch(`& Juliet`))
// console.log(fetch('Toronto Raptors', 'fr'))
// console.log(fetch(['Toronto', 'Montreal'], 'fr'))
// console.log(fetch('https://en.m.wikipedia.org/wiki/Freebase'))
// console.log(fetch('https://fr.wikipedia.org/wiki/Toronto_Raptors'))
// console.log(fetch('https://dota2.gamepedia.com/Abaddon'))
// console.log(fetch('https://muppet.fandom.com/wiki/Debra_Spinney'))
