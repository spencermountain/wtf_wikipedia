const toDate = (obj) => new Date(Date.UTC(obj.year || 0, (obj.month || 1) - 1, obj.date || 1))

// calendar-accurate difference between two y/m/d objects
const delta = function (from, to) {
  let a = toDate(from)
  let b = toDate(to)
  if (a > b) {
    ;[a, b] = [b, a]
  }
  let years = b.getUTCFullYear() - a.getUTCFullYear()
  let months = b.getUTCMonth() - a.getUTCMonth()
  let days = b.getUTCDate() - a.getUTCDate()
  // borrow from the previous month(s) until days is positive
  let borrow = 0
  while (days < 0) {
    months -= 1
    borrow += 1
    days += new Date(Date.UTC(b.getUTCFullYear(), b.getUTCMonth() - borrow + 1, 0)).getUTCDate()
  }
  if (months < 0) {
    years -= 1
    months += 12
  }
  const totalDays = Math.round((b.getTime() - a.getTime()) / (1000 * 60 * 60 * 24))
  // days since the last whole year
  const anniversary = new Date(Date.UTC(a.getUTCFullYear() + years, a.getUTCMonth(), a.getUTCDate()))
  const yearDays = Math.round((b.getTime() - anniversary.getTime()) / (1000 * 60 * 60 * 24))
  let obj: any = { totalDays, yearDays }
  if (years > 0) {
    obj.years = years
  }
  if (months > 0) {
    obj.months = months
  }
  if (days > 0) {
    obj.days = days
  }
  return obj
}

//not all too fancy - used in {{timesince}}
// https://en.wikipedia.org/wiki/Template:Time_ago
// shows the largest whole unit, like '26 years ago' or '3 months from now'
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
  let num = 0
  let unit = 'day'
  if (days >= 365) {
    num = Math.floor(days / 365.25)
    unit = 'year'
  } else if (days >= 30) {
    num = Math.floor(days / 30.4375)
    unit = 'month'
  } else if (days >= 7) {
    num = Math.floor(days / 7)
    unit = 'week'
  } else {
    num = Math.floor(days)
  }
  if (num !== 1) {
    unit += 's'
  }
  return `${num} ${unit} ${predicate}`
}

const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']

export { days, timeSince, delta }
