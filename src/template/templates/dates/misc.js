const format = require('./_format')
const parse = require('../../_parsers/parse')

const toOrdinal = function (i) {
  let j = i % 10
  let k = i % 100
  if (j === 1 && k !== 11) {
    return i + 'st'
  }
  if (j === 2 && k !== 12) {
    return i + 'nd'
  }
  if (j === 3 && k !== 13) {
    return i + 'rd'
  }
  return i + 'th'
}

const misc = {
  //we can't do timezones, so fake this one a little bit
  //https://en.wikipedia.org/wiki/Template:Time
  time: () => {
    let d = new Date()
    let obj = format.ymd([d.getFullYear(), d.getMonth(), d.getDate()])
    return format.toText(obj)
  },

  // https://en.wikipedia.org/wiki/Template:MILLENNIUM
  millennium: (tmpl) => {
    let obj = parse(tmpl, ['year'])
    let year = Number(obj.year)
    year = parseInt(year / 1000, 10) + 1
    if (obj.abbr && obj.abbr === 'y') {
      if (year < 0) {
        return `${toOrdinal(Math.abs(year))} BC`
      }
      return `${toOrdinal(year)}`
    }
    return `${toOrdinal(year)} millennium`
  },
}
module.exports = misc
