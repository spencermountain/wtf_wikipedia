import { redirects } from '../_data/i18n.js'
import parseLink from '../link/parse.js'

//pulls target link out of redirect page
const REDIRECT_REGEX = new RegExp('^[ \n\t]*?#(' + redirects.join('|') + ') *?(\\[\\[.{2,180}?\\]\\])', 'i')

const isRedirect = function (wiki) {
  //too long to be a redirect?
  if (!wiki) {
    return false
  }
  return REDIRECT_REGEX.test(wiki)
}

const parse = function (wiki) {
  let m = wiki.match(REDIRECT_REGEX)
  if (m && m[2]) {
    let links = parseLink(m[2]) || []
    return links[0]
  }
  return {}
}

export { isRedirect, parse }
