import strip from '../../../parse/toJSON/_strip.js'
import parse from '../../../parse/toJSON/index.js'
import { delta } from './_lib.js'
import { ymd, toText } from './_format.js'

//wrap it up as a template
const template = function (date) {
  return {
    template: 'date',
    data: date,
  }
}

const getBoth = function (tmpl) {
  tmpl = strip(tmpl)
  let arr = tmpl.split('|')
  let from = ymd(arr.slice(1, 4))
  let to = arr.slice(4, 7)
  //assume now, if 'to' is empty
  if (to.length === 0) {
    let d = new Date()
    to = [d.getFullYear(), d.getMonth(), d.getDate()]
  }
  to = ymd(to)
  return {
    from: from,
    to: to,
  }
}

const parsers = {
  //generic {{date|year|month|date}} template
  date: (tmpl, list) => {
    let order = ['year', 'month', 'date', 'hour', 'minute', 'second', 'timezone']
    let obj = parse(tmpl, order)
    let data = ymd([obj.year, obj.month, obj.date || obj.day])
    obj.text = toText(data) //make the replacement string
    if (obj.timezone) {
      if (obj.timezone === 'Z') {
        obj.timezone = 'UTC'
      }
      obj.text += ` (${obj.timezone})`
    }
    if (obj.hour && obj.minute) {
      if (obj.second) {
        obj.text = `${obj.hour}:${obj.minute}:${obj.second}, ` + obj.text
      } else {
        obj.text = `${obj.hour}:${obj.minute}, ` + obj.text
      }
    }
    if (obj.text) {
      list.push(template(obj))
    }
    return obj.text
  },

  //support parsing of 'February 10, 1992'
  natural_date: (tmpl, list) => {
    let obj = parse(tmpl, ['text'])
    let str = obj.text || ''
    // - just a year
    let date = {}
    if (/^[0-9]{4}$/.test(str)) {
      date.year = parseInt(str, 10)
    } else {
      //parse the date, using the js date object (for now?)
      let txt = str.replace(/[a-z]+\/[a-z]+/i, '')
      txt = txt.replace(/[0-9]+:[0-9]+(am|pm)?/i, '')
      let d = new Date(txt)
      if (isNaN(d.getTime()) === false) {
        date.year = d.getFullYear()
        date.month = d.getMonth() + 1
        date.date = d.getDate()
      }
    }
    list.push(template(date))
    return str.trim()
  },

  //just grab the first value, and assume it's a year
  one_year: (tmpl, list) => {
    let obj = parse(tmpl, ['year'])
    let year = Number(obj.year)
    list.push(
      template({
        year: year,
      })
    )
    return String(year)
  },

  //assume 'y|m|d' | 'y|m|d' // {{BirthDeathAge|B|1976|6|6|1990|8|8}}
  two_dates: (tmpl, list) => {
    let order = ['b', 'birth_year', 'birth_month', 'birth_date', 'death_year', 'death_month', 'death_date']
    let obj = parse(tmpl, order)
    //'b' means show birth-date, otherwise show death-date
    if (obj.b && obj.b.toLowerCase() === 'b') {
      let date = ymd([obj.birth_year, obj.birth_month, obj.birth_date])
      list.push(template(date))
      return toText(date)
    }
    let date = ymd([obj.death_year, obj.death_month, obj.death_date])
    list.push(template(date))
    return toText(date)
  },

  age: (tmpl) => {
    let d = getBoth(tmpl)
    let diff = delta(d.from, d.to)
    return diff.years || 0
  },

  'diff-y': (tmpl) => {
    let d = getBoth(tmpl)
    let diff = delta(d.from, d.to)
    if (diff.years === 1) {
      return diff.years + ' year'
    }
    return (diff.years || 0) + ' years'
  },

  'diff-ym': (tmpl) => {
    let d = getBoth(tmpl)
    let diff = delta(d.from, d.to)
    let arr = []
    if (diff.years === 1) {
      arr.push(diff.years + ' year')
    } else if (diff.years && diff.years !== 0) {
      arr.push(diff.years + ' years')
    }
    if (diff.months === 1) {
      arr.push('1 month')
    } else if (diff.months && diff.months !== 0) {
      arr.push(diff.months + ' months')
    }
    return arr.join(', ')
  },

  'diff-ymd': (tmpl) => {
    let d = getBoth(tmpl)
    let diff = delta(d.from, d.to)
    let arr = []
    if (diff.years === 1) {
      arr.push(diff.years + ' year')
    } else if (diff.years && diff.years !== 0) {
      arr.push(diff.years + ' years')
    }
    if (diff.months === 1) {
      arr.push('1 month')
    } else if (diff.months && diff.months !== 0) {
      arr.push(diff.months + ' months')
    }
    if (diff.days === 1) {
      arr.push('1 day')
    } else if (diff.days && diff.days !== 0) {
      arr.push(diff.days + ' days')
    }
    return arr.join(', ')
  },

  'diff-yd': (tmpl) => {
    let d = getBoth(tmpl)
    let diff = delta(d.from, d.to)
    let arr = []
    if (diff.years === 1) {
      arr.push(diff.years + ' year')
    } else if (diff.years && diff.years !== 0) {
      arr.push(diff.years + ' years')
    }
    //ergh...
    diff.days += (diff.months || 0) * 30
    if (diff.days === 1) {
      arr.push('1 day')
    } else if (diff.days && diff.days !== 0) {
      arr.push(diff.days + ' days')
    }
    return arr.join(', ')
  },

  'diff-d': (tmpl) => {
    let d = getBoth(tmpl)
    let diff = delta(d.from, d.to)
    let arr = []
    //ergh...
    diff.days += (diff.years || 0) * 365
    diff.days += (diff.months || 0) * 30
    if (diff.days === 1) {
      arr.push('1 day')
    } else if (diff.days && diff.days !== 0) {
      arr.push(diff.days + ' days')
    }
    return arr.join(', ')
  },
}
export default parsers
