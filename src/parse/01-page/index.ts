import { isRedirect, parseRedirect } from './01-isRedirect/redirects.ts'
import preProcess from './03-preProcess/index.ts'
import parseCategories from './02-categories/index.ts'
import parseSections from './04-splitSections/index.ts'
import type { PageData } from '../../types/index.ts'

const parsePage = function (wiki: string) {
  let data: PageData = { wikitext: wiki, remaining: wiki }

  //1. detect if redirect page
  if (isRedirect(wiki)) {
    data.isRedirect = true
    data.redirectTo = parseRedirect(wiki)
    // (they can have categories)
    let res = parseCategories(wiki)
    data.categories = res.categories
    data.remaining = res.wiki
    return data
  }
  //2. cleanup wiki text
  data.remaining = preProcess(wiki)
  // 3. pluck categories from the bottom
  let res = parseCategories(data.remaining)
  data.categories = res.categories
  data.remaining = res.wiki
  // 4. split by section
  data.sections = parseSections(data.remaining)
  return data
}

export default parsePage
