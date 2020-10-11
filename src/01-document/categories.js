const i18n = require('../_data/i18n')
const cat_reg = new RegExp('\\[\\[:?(' + i18n.categories.join('|') + '):(.{2,178}?)]](w{0,10})', 'ig')
const cat_remove_reg = new RegExp('^\\[\\[:?(' + i18n.categories.join('|') + '):', 'ig')

const parse_categories = function (wiki) {
  const categories = []
  let tmp = wiki.match(cat_reg) //regular links
  if (tmp) {
    tmp.forEach(function (c) {
      c = c.replace(cat_remove_reg, '')
      c = c.replace(/\|?[ \*]?\]\]$/i, '') //parse fancy ones..
      c = c.replace(/\|.*/, '') //everything after the '|' is metadata
      if (c && !c.match(/[\[\]]/)) {
        categories.push(c.trim())
      }
    })
  }
  const newWiki = wiki.replace(cat_reg, '')
  return [categories, newWiki]
}
module.exports = parse_categories
