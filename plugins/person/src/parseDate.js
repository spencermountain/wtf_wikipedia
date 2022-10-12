import spacetime from 'spacetime'
// regexes
const regJustYear = /^(?:c\.\s*)?(\d+)\s*(bc|bce|ad|ce)?$/i
const regInaccurate = /((\d+)\s*(or|–|\/)\s*(\d+))\s*(?:bc|bce|ad|ce)?\b/gi
const regRangeSeparator = /–/
const regUptoSecondMill = /\b(\d{1,3})\s*(bc|bce|ad|ce)?$|\b(\d+)\s*(bc|bce)$/i
const regBCE = /(\d+)\s*(bc|bce)\b/i

function findAverage (arr) {
  return arr.reduce((partialSum, n) => partialSum + n) / arr.length
}

function parseDate (str) {
  if (!str) {
    return null
  }
  // remove parentheses
  str = str.replace(/\(.*\)/, '')
  str = str.trim()
  // check for inaccurate dates such as "20 or 21 July 356 BC", "c. 1155/1162", "183–181 BC"
  let inaccurateOriginal
  if (str.match(regInaccurate)) {
    inaccurateOriginal = str // the original str will be added to the final result
    // replace number pairs with a single value
    const inaccurate = [...str.matchAll(regInaccurate)]
    for (const arr of inaccurate) {
      // find the numbers
      let onlyNumbers = [...arr]
      const removeIndexes = [3, 1, 0]
      removeIndexes.forEach(i => onlyNumbers.splice(i, 1))
      onlyNumbers = onlyNumbers.map(i => Number(i))
      // if it's a range, replace with the average rounded down, otherwise with the minimum
      if (arr[3].match(regRangeSeparator)) {
        const avg = findAverage(onlyNumbers)
        if (arr[0].match(regBCE)) {
          str = str.replace(arr[1], Math.ceil(avg))
        } else {
          str = str.replace(arr[1], Math.floor(avg))
        }
      } else if (arr[0].match(regBCE)) {
        str = str.replace(arr[1], Math.max(...onlyNumbers))
      } else {
        str = str.replace(arr[1], Math.min(...onlyNumbers))
      }
    }
  }
  // just the year
  const justYear = str.match(regJustYear)
  // parse the full date; return null if unsuccessful
  let s = spacetime(str)
  let res = {
    year: s.year(),
    month: s.month(),
    date: s.date(),
  }
  if (justYear) {
    if (inaccurateOriginal) {
      Object.defineProperty(res, "originalDate", {
        value: inaccurateOriginal,
      })
    }
    if (str.match(regBCE)) {
      res.year = -parseInt(justYear[1], 10)
    } else {
      res.year = parseInt(justYear[1], 10)
    }
    return res
  }
  // make the years up to the second millennium spacetime-friendly
  const UptoSecondMill = str.match(regUptoSecondMill)
  let year
  if (UptoSecondMill) {
    // trick spacetime to get the month and day correctly by replacing the year with 1000
    str = str.replace(UptoSecondMill[0], "1000")
    // assign the real year
    year = UptoSecondMill.input.match(regBCE) ? -Number(UptoSecondMill[1]) : Number(UptoSecondMill[1])
  }

  const epoch = { // epoch is returned when unsuccessful 
    year: 1970,
    month: 0,
    date: 1,
  }
  if (JSON.stringify(res) === JSON.stringify(epoch)) {
    return null
  }
  res.year = year || s.year()
  if (inaccurateOriginal) {
    Object.defineProperty(res, "originalDate", {
      value: inaccurateOriginal,
    })
  }
  return res
}
export default parseDate