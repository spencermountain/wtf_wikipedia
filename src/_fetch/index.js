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

const fetch = function(title, options) {
  //support lang 2nd param
  if (typeof options === 'string') {
    options = { lang: options }
  }
  options = options || {}
  console.log(options)
  options = Object.assign({}, options, defaults)
  options.title = title

  // parse url input
  if (isUrl.test(title)) {
    options = Object.assign(options, parseUrl(title))
  }
  const url = makeUrl(options)
  return http(url)
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
