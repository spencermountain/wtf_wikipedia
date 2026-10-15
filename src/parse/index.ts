import { isRedirect, parseRedirect } from './01-isRedirect/redirects.ts'
import preProcess from './03-preProcess/index.ts'
import parseCategories from './02-categories/index.ts'
import parseSections from './04-sections/index.ts'

interface PageData {
  wikitext: string
  isRedirect?: boolean
  redirectTo?: string
  categories?: string[]
  sections?: []
}

const parsePage = function (input: string) {
  let data: PageData = { wikitext: input }
  let wiki = input

  //1. detect if redirect page
  if (isRedirect(wiki)) {
    data.isRedirect = true
    data.redirectTo = parseRedirect(wiki)
    // (they can have categories)
    let res = parseCategories(wiki)
    data.categories = res.categories
    wiki = res.wiki
    return data
  }
  //2. cleanup wiki text
  wiki = preProcess(wiki)
  // 3. pluck categories from the bottom
  let res = parseCategories(wiki)
  data.categories = res.categories
  wiki = res.wiki
  // 4. split by section
  data.sections = parseSections(wiki)
  return data
}

export default parsePage
