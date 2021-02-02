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

//this is allowed to be rough
const day = 1000 * 60 * 60 * 24
const month = day * 30
const year = day * 365

const getEpoch = function (obj) {
  return new Date(`${obj.year}-${obj.month || 0}-${obj.date || 1}`).getTime()
}

//very rough!
const delta = function (from, to) {
  from = getEpoch(from)
  to = getEpoch(to)
  let diff = to - from
  let obj = {}
  //get years
  let years = Math.floor(diff / year, 10)
  if (years > 0) {
    obj.years = years
    diff -= obj.years * year
  }
  //get months
  let monthCount = Math.floor(diff / month, 10)
  if (monthCount > 0) {
    obj.months = monthCount
    diff -= obj.months * month
  }
  //get days
  let days = Math.floor(diff / day, 10)
  if (days > 0) {
    obj.days = days
    // diff -= (obj.days * day);
  }
  return obj
}

//not all too fancy - used in {{timesince}}
const timeSince = function (str) {
  let d = new Date(str)
  if (isNaN(d.getTime())) {
    return ''
  }
  let now = new Date()
  let delt = now.getTime() - d.getTime()
  let predicate = 'ago'
  if (delt < 0) {
    predicate = 'from now'
    delt = Math.abs(delt)
  }
  //figure out units
  let hours = delt / 1000 / 60 / 60
  let days = hours / 24
  if (days < 365) {
    return parseInt(days, 10) + ' days ' + predicate
  }
  let years = days / 365
  return parseInt(years, 10) + ' years ' + predicate
}

const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']

module.exports = {
  days: days,
  timeSince: timeSince,
  delta: delta,
  toOrdinal: toOrdinal,
}
