import defaults from '../../_lib/defaults.ts'
import { isRedirect, parseRedirect } from './01-isRedirect/redirects.ts'
import preProcess from './03-preProcess/index.ts'
import parseCategories from './02-categories/index.ts'
import parseSections from './04-splitSections/index.ts'
import type { DocInfo, PageData } from '../../types/index.ts'

const parsePage = function (wiki: string, opts: DocInfo = defaults) {
  let data: PageData = { wiki: wiki, remaining: wiki, sections: [], categories: [] }

  //1. detect if redirect page
  if (isRedirect(wiki)) {
    data.isRedirect = true
    data.redirectTo = parseRedirect(wiki, opts)
    // (they can have categories)
    let res = parseCategories(wiki, opts)
    data.categories = res.categories
    data.remaining = res.wiki
    return data
  }
  //2. cleanup wiki text
  data.remaining = preProcess(wiki, opts)
  // 3. pluck categories from the bottom
  let res = parseCategories(data.remaining, opts)
  data.categories = res.categories
  data.remaining = res.wiki
  // 4. split by section
  data.sections = parseSections(data.remaining, opts)
  return data
}

export default parsePage
