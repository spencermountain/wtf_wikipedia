const { like, dislike, good, bad } = require('./words')
const hasYear = /[0-9]{4}/

const fromCategory = function (doc) {
  let cats = doc.categories()

  // try to focus on the best ones, first
  let tmp = cats.filter((cat) => {
    return good.find((reg) => reg.test(cat))
  })
  if (tmp.length > 0) {
    cats = tmp
  }

  // remove bad ones
  cats = cats.filter((cat) => {
    if (bad.find((reg) => reg.test(cat))) {
      return false
    }
    if (hasYear.test(cat)) {
      return false
    }
    return true
  })

  if (cats.length === 0) {
    return ''
  }
  // look at sorting by preferences
  tmp = cats.filter((cat) => {
    return like.find((reg) => reg.test(cat))
  })
  if (tmp.length > 0) {
    cats = tmp
  }
  // remove disliked ones
  tmp = cats.filter((cat) => {
    return dislike.find((reg) => reg.test(cat)) === null
  })
  if (tmp.length > 0) {
    cats = tmp
  }

  return cats[0]
}
module.exports = fromCategory
