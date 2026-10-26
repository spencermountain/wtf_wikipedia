import defaults from '../../_lib/defaults.ts'
import { isRedirect, parseRedirect } from './01-isRedirect/redirects.ts'
import parseCategories from './03-categories/index.ts'
import parseSections from './04-splitSections/index.ts'
import parseComments from './02-comments/index.ts'
import type { DocInfo, PageData } from '../../types/index.ts'

const parsePage = function (wiki: string, opts: DocInfo = defaults) {
  let page: PageData = { wiki: wiki, remaining: wiki, sections: [], comments: [], categories: [] }

  //1. detect if redirect page
  if (isRedirect(wiki)) {
    page.isRedirect = true
    page.redirectTo = parseRedirect(wiki, opts)
    // (they can have categories)
    page = parseCategories(page)
    return page
  }
  // 2. remove xml comments
  page = parseComments(page)
  // 3. pluck categories from the bottom
  page = parseCategories(page)
  // 4. split by section
  page.sections = parseSections(page.remaining, opts)
  return page
}

export default parsePage
