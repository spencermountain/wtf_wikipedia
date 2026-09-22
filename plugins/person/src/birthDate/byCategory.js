const byCategory = function (doc) {
  const cats = doc.categories()
  for (let i = 0; i < cats.length; i += 1) {
    const m = cats[i].match(/([0-9]{4}) births/)
    if (m && m[1]) {
      const year = parseInt(m[1], 10)
      if (year && year > 1000) {
        return year
      }
    }
  }
  return null
}
export default byCategory
