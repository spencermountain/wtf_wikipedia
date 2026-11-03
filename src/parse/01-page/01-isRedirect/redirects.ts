import type { DocInfo } from '../../../types/index.ts'
import defaults from '../../../_lib/defaults.ts'
import { defaultWorld } from '../../../world/index.ts'
import parseLink from '../../block/links/parse.ts'

const isRedirect = function (wiki: string) {
  //too long to be a redirect?
  if (!wiki) {
    return false
  }
  return defaultWorld._cached.redirectReg.test(wiki)
}

const parseRedirect = function (wiki: string, opts: DocInfo = defaults) {
  let m = wiki.match(defaultWorld._cached.redirectReg)
  if (m && m[2]) {
    let links = parseLink(m[2], opts) || []
    return links[0]
  }
  return null
}

export { isRedirect, parseRedirect }
