function toOrdinal (i) {
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

function getEpoch (obj) {
  return new Date(`${obj.year}-${obj.month || 0}-${obj.date || 1}`).getTime()
}

//very rough!

function delta (from, to) {
  let diff = getEpoch(to) - getEpoch(from)
  // @ts-expect-error
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
function timeSince (str) {
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

export { days, timeSince, delta, toOrdinal }
