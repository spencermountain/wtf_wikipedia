// 'Category:People from Geneva' → 'Geneva'
const byCategory = function (doc) {
  const cats = doc.categories()
  for (let i = 0; i < cats.length; i += 1) {
    const m = cats[i].match(/^People from (.+)$/)
    if (m && m[1]) {
      return m[1]
    }
  }
  return null
}
export default byCategory
