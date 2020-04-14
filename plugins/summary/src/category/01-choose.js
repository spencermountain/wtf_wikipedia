const { like, dislike, good, bad } = require('./regs')
const hasYear = /[0-9]{4}/
const isPlural = /s$/

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
    // not a plural ending
    if (isPlural.test(cat) === false) {
      return false
    }
    // just one word
    if (cat.slice(' ').length === 1) {
      return false
    }
    return dislike.find((reg) => reg.test(cat)) === undefined
  })
  if (tmp.length > 0) {
    cats = tmp
  }

  // sort them by most words
  cats = cats.sort((a, b) => {
    let aWords = a.split(' ').length
    let bWords = b.split(' ').length
    if (aWords > bWords) {
      return -1
    } else if (aWords < bWords) {
      return 1
    }
    return 0
  })
  // console.log(cats)

  return cats[0]
}
module.exports = fromCategory
