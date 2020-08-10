const languages = require('../_data/languages')
//some colon symbols are valid links, like `America: That place`
//so we have to whitelist allowable interwiki links
const interwikis = require('../_data/interwiki')

//add language prefixes too..
Object.keys(languages).forEach(k => {
  interwikis[k] = k + '.wikipedia.org/wiki/$1'
})

//this is predictably very complicated.
// https://meta.wikimedia.org/wiki/Help:Interwiki_linking
const parseInterwiki = function(obj) {
  let str = obj.page || ''
  if (str.indexOf(':') !== -1) {
    let m = str.match(/^(.*):(.*)/)
    if (m === null) {
      return obj
    }
    let site = m[1] || ''
    site = site.toLowerCase()
    if (site.indexOf(':') !== -1) {
      let [, wiki, lang] = site.match(/^:?(.*):(.*)/)
      //only allow interwikis to these specific places
      if (
        interwikis.hasOwnProperty(wiki) && languages.hasOwnProperty(lang) === false
      ) {
        return obj
      }
      obj.wiki = { wiki: wiki, lang: lang }
    } else {
      if (interwikis.hasOwnProperty(site) === false) {
        return obj
      }
      obj.wiki = site
    }
    obj.page = m[2]
  }
  return obj
}
module.exports = parseInterwiki
