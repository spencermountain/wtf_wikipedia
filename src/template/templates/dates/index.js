const misc = require('./misc')
const parsers = require('./parsers')
const parse = require('../../_parsers/parse')
const timeSince = require('./_timeSince')
const format = require('./_format')
const date = parsers.date
const natural_date = parsers.natural_date

const months = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December'
]
const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']

//date- templates we support
let dateTmpl = Object.assign({}, misc, {
  currentday: () => {
    let d = new Date()
    return String(d.getDate())
  },
  currentdayname: () => {
    let d = new Date()
    return days[d.getDay()]
  },
  currentmonth: () => {
    let d = new Date()
    return months[d.getMonth()]
  },
  currentyear: () => {
    let d = new Date()
    return String(d.getFullYear())
  },
  monthyear: () => {
    let d = new Date()
    return months[d.getMonth()] + ' ' + d.getFullYear()
  },
  'monthyear-1': () => {
    let d = new Date()
    d.setMonth(d.getMonth() - 1)
    return months[d.getMonth()] + ' ' + d.getFullYear()
  },
  'monthyear+1': () => {
    let d = new Date()
    d.setMonth(d.getMonth() + 1)
    return months[d.getMonth()] + ' ' + d.getFullYear()
  },
  //Explictly-set dates - https://en.wikipedia.org/wiki/Template:Date
  date: 0,
  'time ago': tmpl => {
    let order = ['date', 'fmt']
    let time = parse(tmpl, order).date
    return timeSince(time)
  },
  //https://en.wikipedia.org/wiki/Template:Birth_date_and_age
  'birth date and age': (tmpl, list) => {
    let order = ['year', 'month', 'day']
    let obj = parse(tmpl, order)
    //support 'one property' version
    if (obj.year && /[a-z]/i.test(obj.year)) {
      return natural_date(tmpl, list)
    }
    list.push(obj)
    obj = format.ymd([obj.year, obj.month, obj.day])
    return format.toText(obj)
  },
  'birth year and age': (tmpl, list) => {
    let order = ['birth_year', 'birth_month']
    let obj = parse(tmpl, order)
    //support 'one property' version
    if (obj.death_year && /[a-z]/i.test(obj.death_year)) {
      return natural_date(tmpl, list)
    }
    list.push(obj)
    let age = new Date().getFullYear() - parseInt(obj.birth_year, 10)
    obj = format.ymd([obj.birth_year, obj.birth_month])
    let str = format.toText(obj)
    if (age) {
      str += ` (age ${age})`
    }
    return str
  },
  'death year and age': (tmpl, list) => {
    let order = ['death_year', 'birth_year', 'death_month']
    let obj = parse(tmpl, order)
    //support 'one property' version
    if (obj.death_year && /[a-z]/i.test(obj.death_year)) {
      return natural_date(tmpl, list)
    }
    list.push(obj)
    obj = format.ymd([obj.death_year, obj.death_month])
    return format.toText(obj)
  },
  //https://en.wikipedia.org/wiki/Template:Birth_date_and_age2
  'birth date and age2': (tmpl, list) => {
    let order = ['at_year', 'at_month', 'at_day', 'birth_year', 'birth_month', 'birth_day']
    let obj = parse(tmpl, order)
    list.push(obj)
    obj = format.ymd([obj.birth_year, obj.birth_month, obj.birth_day])
    return format.toText(obj)
  },
  //https://en.wikipedia.org/wiki/Template:Birth_based_on_age_as_of_date
  'birth based on age as of date': (tmpl, list) => {
    let order = ['age', 'year', 'month', 'day']
    let obj = parse(tmpl, order)
    list.push(obj)
    let age = parseInt(obj.age, 10)
    let year = parseInt(obj.year, 10)
    let born = year - age
    if (born && age) {
      return `${born} (age ${obj.age})`
    }
    return `(age ${obj.age})`
  },
  //https://en.wikipedia.org/wiki/Template:Death_date_and_given_age
  'death date and given age': (tmpl, list) => {
    let order = ['year', 'month', 'day', 'age']
    let obj = parse(tmpl, order)
    list.push(obj)
    obj = format.ymd([obj.year, obj.month, obj.day])
    let str = format.toText(obj)
    if (obj.age) {
      str += ` (age ${obj.age})`
    }
    return str
  },
  //sortable dates -
  dts: tmpl => {
    //remove formatting stuff, ewww
    tmpl = tmpl.replace(/\|format=[ymd]+/i, '')
    tmpl = tmpl.replace(/\|abbr=(on|off)/i, '')
    let order = ['year', 'month', 'date', 'bc']
    let obj = parse(tmpl, order)
    if (obj.date && obj.month && obj.year) {
      //render 'june 5 2018'
      if (/[a-z]/.test(obj.month) === true) {
        return [obj.month, obj.date, obj.year].join(' ')
      }
      return [obj.year, obj.month, obj.date].join('-')
    }
    if (obj.month && obj.year) {
      return [obj.year, obj.month].join('-')
    }
    if (obj.year) {
      if (obj.year < 0) {
        obj.year = Math.abs(obj.year) + ' BC'
      }
      return obj.year
    }
    return ''
  },
  //date/age/time templates
  start: date,
  end: date,
  birth: date,
  death: date,
  'start date': date,
  'end date': date,
  'birth date': date,
  'death date': date,
  'start date and age': date,
  'end date and age': date,
  //this is insane (hyphen ones are different)
  'start-date': natural_date,
  'end-date': natural_date,
  'birth-date': natural_date,
  'death-date': natural_date,
  'birth-date and age': natural_date,
  'birth-date and given age': natural_date,
  'death-date and age': natural_date,
  'death-date and given age': natural_date,

  birthdeathage: parsers.two_dates,
  dob: date,
  // 'birth date and age2': date,

  age: parsers.age,
  'age nts': parsers.age,
  'age in years': parsers['diff-y'],
  'age in years and months': parsers['diff-ym'],
  'age in years, months and days': parsers['diff-ymd'],
  'age in years and days': parsers['diff-yd'],
  'age in days': parsers['diff-d']
  // 'age in years, months, weeks and days': true,
  // 'age as of date': true,
})
//aliases
dateTmpl.localday = dateTmpl.currentday
dateTmpl.localdayname = dateTmpl.currentdayname
dateTmpl.localmonth = dateTmpl.currentmonth
dateTmpl.localyear = dateTmpl.currentyear
dateTmpl.currentmonthname = dateTmpl.currentmonth
dateTmpl.currentmonthabbrev = dateTmpl.currentmonth
dateTmpl['death date and age'] = dateTmpl['birth date and age']
dateTmpl.bda = dateTmpl['birth date and age']
dateTmpl['birth date based on age at death'] = dateTmpl['birth based on age as of date']
module.exports = dateTmpl
