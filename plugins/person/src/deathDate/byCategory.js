function byCategory (doc) {
  let cats = doc.categories()
  for (let i = 0; i < cats.length; i += 1) {
    let m = cats[i].match(/([0-9]{4}) deaths/)
    if (m && m[1]) {
      let year = parseInt(m[1], 10)
      if (year && year > 1000) {
        return year
      }
    }
  }
  return null
}
export default byCategory
