import parsers from './_parsers.ts'
import defaultParse from '../../../parse/templates/parse/toJSON/text.ts'
import { days, timeSince } from './_lib.ts'
import { toOrdinal } from '../../_lib.ts'
import { ymd, toText, toTextBritish } from './_format.ts'

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
  'December',
]

//date- templates we support
export default {
  monthname: (tmpl, parse = defaultParse) => {
    const obj = parse(tmpl, ['month'])
    return { data: null, replacement: months[Number(obj.month) - 1] || '' }
  },
  currentday: () => {
    let d = new Date()
    return { data: null, replacement: String(d.getDate()) }
  },
  currentdayname: () => {
    let d = new Date()
    return { data: null, replacement: days[d.getDay()] }
  },
  currentmonth: () => {
    let d = new Date()
    return { data: null, replacement: months[d.getMonth()] }
  },
  currentyear: () => {
    let d = new Date()
    return { data: null, replacement: String(d.getFullYear()) }
  },
  monthyear: () => {
    let d = new Date()
    return { data: null, replacement: months[d.getMonth()] + ' ' + d.getFullYear() }
  },
  'monthyear-1': () => {
    let d = new Date()
    d.setMonth(d.getMonth() - 1)
    return { data: null, replacement: months[d.getMonth()] + ' ' + d.getFullYear() }
  },
  'monthyear+1': () => {
    let d = new Date()
    d.setMonth(d.getMonth() + 1)
    return { data: null, replacement: months[d.getMonth()] + ' ' + d.getFullYear() }
  },

  year: (tmpl, parse = defaultParse) => {
    let date = parse(tmpl, ['date']).date
    let d = new Date(date)
    if (date && isNaN(d.getTime()) === false) {
      return { data: null, replacement: String(d.getFullYear()) }
    }
    return { data: null, replacement: '' }
  },

  'time ago': (tmpl, parse = defaultParse) => {
    let time = parse(tmpl, ['date', 'fmt']).date
    return { data: null, replacement: timeSince(time) }
  },
  'birth date': (tmpl, parse = defaultParse) => {
    let obj = parse(tmpl, ['year', 'month', 'date'])
    const payload = obj
    obj = ymd([obj.year, obj.month, obj.day])
    return { data: payload, replacement: toText(obj) }
  },
  //https://en.wikipedia.org/wiki/Template:Birth_date_and_age
  'birth date and age': (tmpl, parse = defaultParse) => {
    let obj = parse(tmpl, ['year', 'month', 'day'])
    //support 'one property' version
    if (obj.year && /[a-z]/i.test(obj.year)) {
      return parsers.natural_date(tmpl, parse)
    }
    const payload = obj
    obj = ymd([obj.year, obj.month, obj.day])
    return { data: payload, replacement: toText(obj) }
  },
  'birth year and age': (tmpl, parse = defaultParse) => {
    let obj = parse(tmpl, ['birth_year', 'birth_month'])
    //support 'one property' version
    if (obj.death_year && /[a-z]/i.test(obj.death_year)) {
      return parsers.natural_date(tmpl, parse)
    }
    const payload = obj
    let age = new Date().getFullYear() - parseInt(obj.birth_year, 10)
    obj = ymd([obj.birth_year, obj.birth_month])
    let str = toText(obj)
    if (age) {
      str += ` (age ${age})`
    }
    return { data: payload, replacement: str }
  },
  'death year and age': (tmpl, parse = defaultParse) => {
    let obj = parse(tmpl, ['death_year', 'birth_year', 'death_month'])
    //support 'one property' version
    if (obj.death_year && /[a-z]/i.test(obj.death_year)) {
      return parsers.natural_date(tmpl, parse)
    }
    const payload = obj
    obj = ymd([obj.death_year, obj.death_month])
    return { data: payload, replacement: toText(obj) }
  },
  //https://en.wikipedia.org/wiki/Template:Birth_date_and_age2
  'birth date and age2': (tmpl, parse = defaultParse) => {
    let order = ['at_year', 'at_month', 'at_day', 'birth_year', 'birth_month', 'birth_day']
    let obj = parse(tmpl, order)
    const payload = obj
    obj = ymd([obj.birth_year, obj.birth_month, obj.birth_day])
    return { data: payload, replacement: toText(obj) }
  },
  //https://en.wikipedia.org/wiki/Template:Birth_based_on_age_as_of_date
  'birth based on age as of date': (tmpl, parse = defaultParse) => {
    let obj = parse(tmpl, ['age', 'year', 'month', 'day'])
    let age = parseInt(obj.age, 10)
    let year = parseInt(obj.year, 10)
    let born = year - age
    if (born && age) {
      return { data: obj, replacement: `${born} (age ${obj.age})` }
    }
    return { data: obj, replacement: `(age ${obj.age})` }
  },
  //https://en.wikipedia.org/wiki/Template:Death_date_and_given_age
  'death date and given age': (tmpl, parse = defaultParse) => {
    let obj = parse(tmpl, ['year', 'month', 'day', 'age'])
    const payload = obj
    obj = ymd([obj.year, obj.month, obj.day])
    let str = toText(obj)
    if (obj.age) {
      str += ` (age ${obj.age})`
    }
    return { data: payload, replacement: str }
  },
  //sortable dates -
  dts: (tmpl, parse = defaultParse) => {
    //remove formatting stuff, ewww
    tmpl = tmpl.replace(/\|format=[ymd]+/i, '')
    tmpl = tmpl.replace(/\|abbr=(on|off)/i, '')
    let obj = parse(tmpl, ['year', 'month', 'date', 'bc'])
    if (obj.date && obj.month && obj.year) {
      //render 'june 5 2018'
      if (/[a-z]/.test(obj.month) === true) {
        return { data: null, replacement: [obj.month, obj.date, obj.year].join(' ') }
      }
      return { data: null, replacement: [obj.year, obj.month, obj.date].join('-') }
    }
    if (obj.month && obj.year) {
      return { data: null, replacement: [obj.year, obj.month].join('-') }
    }
    if (obj.year) {
      if (obj.year < 0) {
        obj.year = Math.abs(obj.year) + ' BC'
      }
      return { data: null, replacement: obj.year }
    }
    return { data: null, replacement: '' }
  },

  //we can't do timezones, so fake this one a little bit
  //https://en.wikipedia.org/wiki/Template:Time
  time: () => {
    let d = new Date()
    let obj = ymd([d.getFullYear(), d.getMonth() + 1, d.getDate()])
    return { data: null, replacement: toText(obj) }
  },

  // https://en.wikipedia.org/wiki/Template:MILLENNIUM
  millennium: (tmpl, parse = defaultParse) => {
    let obj = parse(tmpl, ['year'])
    let year = parseInt(obj.year, 10)
    year = Math.floor(year / 1000) + 1
    if (obj.abbr && obj.abbr === 'y') {
      if (year < 0) {
        return { data: null, replacement: `${toOrdinal(Math.abs(year))} BC` }
      }
      return { data: null, replacement: `${toOrdinal(year)}` }
    }
    return { data: null, replacement: `${toOrdinal(year)} millennium` }
  },
  //date/age/time templates
  start: parsers.date,
  'start-date': parsers.natural_date,
  birthdeathage: parsers.two_dates,
  age: parsers.age,
  'age nts': parsers.age,
  'age in years': parsers['diff-y'],
  'age in years and months': parsers['diff-ym'],
  'age in years, months and days': parsers['diff-ymd'],
  'age in years and days': parsers['diff-yd'],
  'age in days': parsers['diff-d'],
  // 'birth date and age2': date,
  // 'age in years, months, weeks and days': true,
  // 'age as of date': true,
  // https://en.wikipedia.org/wiki/Template:As_of
  'as of': (tmpl, parse = defaultParse) => {
    let obj = parse(tmpl, ['year', 'month', 'day'])
    if (obj.alt) {
      return { data: null, replacement: obj.alt }
    }
    let out = 'As of '
    if (obj.since) {
      out = 'Since '
    }
    if (obj.lc) {
      out = out.toLowerCase()
    }
    if (obj.bare) {
      out = ''
    }
    if (obj.pre) {
      out += obj.pre + ' '
    }
    let format = toTextBritish
    if (obj.df == 'US') {
      format = toText
    }
    let dateObj = ymd([obj.year, obj.month, obj.day])
    out += format(dateObj)
    if (obj.post) {
      out += obj.post
    }
    return { data: null, replacement: out }
  },
}
