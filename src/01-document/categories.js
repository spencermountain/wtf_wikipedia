const i18n = require('../_data/i18n')
const cat_reg = new RegExp('\\[\\[:?(' + i18n.categories.join('|') + '):(.{2,178}?)]](w{0,10})', 'ig')
const cat_remove_reg = new RegExp('^\\[\\[:?(' + i18n.categories.join('|') + '):', 'ig')

const parse_categories = function(doc) {
  let wiki = doc.wiki
  let tmp = wiki.match(cat_reg) //regular links
  if (tmp) {
    tmp.forEach(function(c) {
      c = c.replace(cat_remove_reg, '')
      c = c.replace(/\|?[ \*]?\]\]$/i, '') //parse fancy onces..
      c = c.replace(/\|.*/, '') //everything after the '|' is metadata
      if (c && !c.match(/[\[\]]/)) {
        doc.categories.push(c.trim())
      }
    })
  }
  wiki = wiki.replace(cat_reg, '')
  doc.wiki = wiki
}
module.exports = parse_categories
