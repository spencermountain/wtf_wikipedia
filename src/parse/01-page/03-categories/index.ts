import type { PageData } from '../../../types/index.ts'
import { defaultWorld } from '../../../world/index.ts'

const parse_categories = function (page: PageData) {
  const { catReg: cat_reg, catRemoveReg: cat_remove_reg } = defaultWorld._cached
  let wiki = page.remaining
  const categories = []
  const categoryDetails = []
  let tmp = wiki.match(cat_reg) //regular links
  if (tmp) {
    tmp.forEach(function (c) {
      const source = c
      c = c.replace(cat_remove_reg, '')
      c = c.replace(/\|?[ *]?\]\]$/, '') //parse fancy ones..
      c = c.replace(/\|.*/, '') //everything after the '|' is metadata
      if (c && !c.match(/[[\]]/)) {
        categories.push(c.trim())
        categoryDetails.push({ text: c.trim(), wiki: source })
      }
    })
  }
  page.remaining = wiki.replace(cat_reg, '')
  page.categories = categories
  return page
}
export default parse_categories
