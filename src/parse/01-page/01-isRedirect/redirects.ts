import { redirects } from '../../../_data/i18n/index.ts'
import parseLink from '../../block/links/parse.ts'

//pulls target link out of redirect page
const REDIRECT_REGEX = new RegExp('^[ \n\t]*?#(' + redirects.join('|') + ') *?(\\[\\[.{2,180}?\\]\\])', 'i')

const isRedirect = function (wiki: string) {
  //too long to be a redirect?
  if (!wiki) {
    return false
  }
  return REDIRECT_REGEX.test(wiki)
}

const parseRedirect = function (wiki: string) {
  let m = wiki.match(REDIRECT_REGEX)
  if (m && m[2]) {
    let links = parseLink(m[2]) || []
    return links[0]
  }
  return {}
}

export { isRedirect, parseRedirect }
