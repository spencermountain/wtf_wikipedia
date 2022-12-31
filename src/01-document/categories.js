import { categories as _categories } from '../_data/i18n.js'

const cat_reg = new RegExp('\\[\\[(' + _categories.join('|') + '):(.{2,178}?)]](w{0,10})', 'gi')
const cat_remove_reg = new RegExp('^\\[\\[:?(' + _categories.join('|') + '):', 'gi')

const parse_categories = function (wiki) {
  const categories = []
  let tmp = wiki.match(cat_reg) //regular links
  if (tmp) {
    tmp.forEach(function (c) {
      c = c.replace(cat_remove_reg, '')
      c = c.replace(/\|?[ *]?\]\]$/, '') //parse fancy ones..
      c = c.replace(/\|.*/, '') //everything after the '|' is metadata
      if (c && !c.match(/[[\]]/)) {
        categories.push(c.trim())
      }
    })
  }
  const newWiki = wiki.replace(cat_reg, '')
  return [categories, newWiki]
}
export default parse_categories
