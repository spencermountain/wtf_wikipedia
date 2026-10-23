import type { DocInfo } from '../../../types/index.ts'
import defaults from '../../../_lib/defaults.ts'
import languages from '../../../_data/languages.ts'
import interwikis from '../../../_data/interwiki.ts'
import normalizeProject from '../../../_lib/project.ts'
import type { InternalLinkData } from '../../../types/index'
//some colon symbols are valid links, like `America: That place`
//so we have to whitelist allowable interwiki links
//add language prefixes too..
Object.keys(languages).forEach((k) => {
  interwikis[k] = k + '.wikipedia.org/wiki/$1'
})

//this is predictably very complicated.
// https://meta.wikimedia.org/wiki/Help:Interwiki_linking
const parseInterwiki = function (obj: InternalLinkData, _opts: DocInfo = defaults) {
  let str = obj.page || ''
  const leadingColon = str.startsWith(':')
  if (leadingColon) {
    str = str.slice(1)
  }
  if (str.indexOf(':') !== -1) {
    let m = str.match(/^([^:]+):(.*)/)
    if (m === null) {
      return obj
    }
    let site = m[1] || ''
    site = site.toLowerCase()
    const project = normalizeProject(site)
    if (Object.hasOwn(interwikis, project) === false) {
      return obj
    }
    obj.page = m[2]
    if (Object.hasOwn(languages, site)) {
      obj.lang = site
      obj.inline = leadingColon
    } else if (project === 'doi') {
      obj.prefix = project
      obj.inline = true
    } else {
      obj.project = project
      obj.inline = true
      // Consume a language prefix only; other colons belong to the target title.
      const qualified = obj.page.match(/^([^:]+):(.*)/)
      if (qualified && Object.hasOwn(languages, qualified[1].toLowerCase())) {
        obj.lang = qualified[1].toLowerCase()
        obj.page = qualified[2]
      }
    }
  }
  if (obj.lang || obj.project || obj.prefix) {
    obj.type = 'interwiki'
    obj.text = obj.inline ? str : ''
  }
  return obj
}
export default parseInterwiki
