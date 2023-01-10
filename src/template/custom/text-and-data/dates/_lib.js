

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
  let years = Math.floor(diff / year)
  if (years > 0) {
    obj.years = years
    diff -= obj.years * year
  }
  //get months
  let monthCount = Math.floor(diff / month)
  if (monthCount > 0) {
    obj.months = monthCount
    diff -= obj.months * month
  }
  //get days
  let days = Math.floor(diff / day)
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
    return Number(days) + ' days ' + predicate
  }
  let years = days / 365
  return Number(years) + ' years ' + predicate
}

const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']

export { days, timeSince, delta }