//assorted parsing methods for date/time templates
const months = [
  undefined, //1-based months.. :/
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

const monthName = months.reduce((h, str, i) => {
  if (i === 0) {
    return h
  }
  h[str.toLowerCase()] = i
  h[str.substring(0, 3).toLowerCase()] = i
  return h
}, {})

//parse year|month|date numbers
const ymd = function (arr) {
  let obj = {}
  let units = ['year', 'month', 'date', 'hour', 'minute', 'second']
  //parse each unit in sequence..
  for (let i = 0; i < units.length; i += 1) {
    //skip it
    if (!arr[i] && arr[1] !== 0) {
      continue
    }
    let num = parseInt(arr[i], 10)
    if (isNaN(num) === false) {
      obj[units[i]] = num //we good.
    } else if (units[i] === 'month') {
      let m = arr[i].toLowerCase().trim()
      //try for month-name, like 'january
      if (monthName.hasOwnProperty(m)) {
        let month = monthName[m]
        obj[units[i]] = month
      }
    } else {
      //we dead. so skip this unit
      delete obj[units[i]]
    }
  }
  //try for timezone,too ftw
  let last = arr[arr.length - 1] || ''
  last = String(last)
  if (last.toLowerCase() === 'z') {
    obj.tz = 'UTC'
  } else if (/[+-][0-9]+:[0-9]/.test(last)) {
    obj.tz = arr[6]
  }
  return obj
}

//zero-pad a number
const pad = function (num) {
  if (num < 10) {
    return '0' + num
  }
  return String(num)
}

const toText = function (date) {
  //eg '1995'
  let str = String(date.year || '')
  if (date.month !== undefined && months.hasOwnProperty(date.month) === true) {
    if (date.date === undefined) {
      //January 1995
      str = `${months[date.month]} ${date.year}`
    } else {
      //January 5, 1995
      str = `${months[date.month]} ${date.date}, ${date.year}`
      //add times, if available
      if (date.hour !== undefined && date.minute !== undefined) {
        let time = `${pad(date.hour)}:${pad(date.minute)}`
        if (date.second !== undefined) {
          time = time + ':' + pad(date.second)
        }
        str = time + ', ' + str
        //add timezone, if there, at the end in brackets
      }
      if (date.tz) {
        str += ` (${date.tz})`
      }
    }
  }
  return str
}

const toTextBritish = function (date) {
  //eg '1995'
  let str = String(date.year || '')
  if (date.month !== undefined && months.hasOwnProperty(date.month) === true) {
    if (date.date === undefined) {
      //January 1995
      str = `${months[date.month]} ${date.year}`
    } else {
      //5 January 1995
      str = `${date.date} ${months[date.month]} ${date.year}`
      //add times, if available
      if (date.hour !== undefined && date.minute !== undefined) {
        let time = `${pad(date.hour)}:${pad(date.minute)}`
        if (date.second !== undefined) {
          time = time + ':' + pad(date.second)
        }
        str = time + ', ' + str
        //add timezone, if there, at the end in brackets
      }
      if (date.tz) {
        str += ` (${date.tz})`
      }
    }
  }
  return str
}

export { toText, toTextBritish, ymd }

// console.log(toText(ymd([2018, 3, 28])));
