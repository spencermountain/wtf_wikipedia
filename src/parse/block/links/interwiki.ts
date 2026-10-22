import languages from '../../../_data/languages.ts'
import interwikis from '../../../_data/interwiki.ts'
import type { InternalLinkData } from '../../../types/index'
//some colon symbols are valid links, like `America: That place`
//so we have to whitelist allowable interwiki links
//add language prefixes too..
Object.keys(languages).forEach((k) => {
  interwikis[k] = k + '.wikipedia.org/wiki/$1'
})

//this is predictably very complicated.
// https://meta.wikimedia.org/wiki/Help:Interwiki_linking
const parseInterwiki = function (obj: InternalLinkData) {
  let str = obj.page || ''
  if (str.indexOf(':') !== -1) {
    let m = str.match(/^(.*):(.*)/)
    if (m === null) {
      return obj
    }
    let site = m[1] || ''
    site = site.toLowerCase()
    // double colon - [[m:Help:Help]]
    if (site.indexOf(':') !== -1) {
      let [, project, lang] = site.match(/^:?(.*):(.*)/)
      //only allow interwikis to these specific places
      if (Object.hasOwn(interwikis, project) === false || Object.hasOwn(languages, lang) === false) {
        return obj
      }
      obj.lang = lang
      obj.project = project
    } else {
      // [[fr:cool]]
      if (Object.hasOwn(interwikis, site) === false) {
        return obj
      }
      obj.lang = site
    }
    obj.page = m[2]
  }
  if (obj.lang || obj.project) {
    obj.type = 'interwiki'
  }
  return obj
}
export default parseInterwiki
