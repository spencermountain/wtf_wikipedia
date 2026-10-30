import test from 'tape'
import wtf from '../../lib/index.js'

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
const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']

// full years between two dates, the way {{age}} counts them
const yearsSince = (y, m, d, now = new Date()) => {
  let years = now.getFullYear() - y
  if (now.getMonth() + 1 < m || (now.getMonth() + 1 === m && now.getDate() < d)) years -= 1
  return years
}

test('date templates - text output', (t) => {
  const arr = [
    // birth/death/start/end, full and partial dates
    ['{{birth date|1993|2|24}}', 'February 24, 1993'],
    ['{{Birth date|1993|02|04}}', 'February 4, 1993'],
    ['{{birth date|1941|4}}', 'April 1941'],
    ['{{birth date|1941}}', '1941'],
    ['{{death date|1993|2|24}}', 'February 24, 1993'],
    ['{{death date|1642|1|30|mf=yes}}', 'January 30, 1642'],
    ['{{birth date and age|1993|2|24|mf=yes}}', 'February 24, 1993'],
    ['{{birth date and age|1993|january|14}}', 'January 14, 1993'],
    ['{{birth date and age|February 10, 1992}}', 'February 10, 1992'],
    ['{{birth date and age2|2020|1|1|1990|5|5}}', 'May 5, 1990'],
    ['{{start date|1993|2|24}}', 'February 24, 1993'],
    ['{{start date|2010|May|3}}', 'May 3, 2010'],
    ['{{start date|1993|2|24|15|30}}', '15:30, February 24, 1993'],
    ['{{start date|2010|5|3|12|30|00|Z}}', '12:30:00, May 3, 2010 (UTC)'],
    ['{{start date and age|2010|5}}', 'May 2010'],
    ['{{end date|1993|2|24}}', 'February 24, 1993'],
    ['{{end date|2010}}', '2010'],
    ['{{start|2010|5|3}}', 'May 3, 2010'],
    ['{{start-date|February 10, 1992}}', 'February 10, 1992'],
    // birth-or-death pickers
    ['{{BirthDeathAge|B|1976|6|6|1990|8|8}}', 'June 6, 1976'],
    ['{{BirthDeathAge||1976|6|6|1990|8|8}}', 'August 8, 1990'],
    ['{{death year and age|2017|1967}}', '2017'],
    // misc
    ['{{monthname|3}}', 'March'],
    ['{{monthname|12}}', 'December'],
    ['{{monthname|13}}', ''],
    ['{{year|2010-05-03}}', '2010'],
    ['{{dts|-200}}', '200 BC'],
    ['{{millennium|2001}}', '3rd millennium'],
    ['{{millennium|1999|abbr=y}}', '2nd'],
    // {{as of}} is dmy by default
    ['{{as of|2010|1|5}}', 'As of 5 January 2010'],
    ['{{as of|2010|1|5|df=US}}', 'As of January 5, 2010'],
    ['{{as of|2010}}', 'As of 2010'],
    ['{{as of|2010|1|lc=y}}', 'as of January 2010'],
    ['{{as of|2010|since=y}}', 'Since 2010'],
    // date differences with explicit end dates
    ['{{age|1990|1|1|2020|1|1}}', '30'],
    ['{{age|1990|6|15|2000|6|15}}', '10'],
    ['{{age in years|1990|1|1|2020|6|1}}', '30 years'],
    ['{{age in years|2019|1|1|2020|6|1}}', '1 year'],
    ['{{age in days|2000|1|1|2000|1|11}}', '10 days'],
  ]
  arr.forEach(([str, want]) => {
    t.equal(wtf(str).text(), want, str)
  })
  t.end()
})

test('date templates - inside a sentence', (t) => {
  const doc = wtf('She was born on {{birth date|1941|4|12}} in [[Ohio]]. She died {{death date|1993|2|24}}.')
  t.equal(doc.sentences()[0].text(), 'She was born on April 12, 1941 in Ohio.', 'birth date mid-sentence')
  t.equal(doc.sentences()[1].text(), 'She died February 24, 1993.', 'death date ends sentence')
  t.equal(doc.sentences()[0].links()[0].page(), 'Ohio', 'link after template survives')
  t.end()
})

test('date templates - json data', (t) => {
  let data = wtf('{{start date|1993|2|24|15|30}}').templates()[0].json().data
  t.equal(data.year, '1993', 'start date year')
  t.equal(data.month, '2', 'start date month')
  t.equal(data.hour, '15', 'start date hour')
  t.equal(data.minute, '30', 'start date minute')

  data = wtf('{{start date|2010|5|3|12|30|00|Z}}').templates()[0].json().data
  t.equal(data.timezone, 'UTC', 'Z timezone becomes UTC')

  data = wtf('{{start-date|February 10, 1992}}').templates()[0].json().data
  t.deepEqual([data.year, data.month, data.date], [1992, 2, 10], 'natural date is parsed into numbers')

  data = wtf('{{BirthDeathAge|B|1976|6|6|1990|8|8}}').templates()[0].json().data
  t.deepEqual([data.year, data.month, data.date], [1976, 6, 6], 'BirthDeathAge birth payload')

  data = wtf('{{death date and age|1993|2|24|1941|4|12}}').templates()[0].json().data
  t.equal(data.year, '1993', 'death date and age keeps death year')
  t.end()
})

test('date templates - relative to today', (t) => {
  const now = new Date()
  t.equal(wtf('{{currentyear}}').text(), String(now.getFullYear()), 'currentyear')
  t.equal(wtf('{{currentmonth}}').text(), months[now.getMonth()], 'currentmonth')
  t.equal(wtf('{{currentday}}').text(), String(now.getDate()), 'currentday')
  t.equal(wtf('{{currentdayname}}').text(), days[now.getDay()], 'currentdayname')
  t.equal(wtf('{{monthyear}}').text(), `${months[now.getMonth()]} ${now.getFullYear()}`, 'monthyear')
  const prev = new Date(now.getFullYear(), now.getMonth() - 1, 1)
  t.equal(wtf('{{monthyear-1}}').text(), `${months[prev.getMonth()]} ${prev.getFullYear()}`, 'monthyear-1')
  const next = new Date(now.getFullYear(), now.getMonth() + 1, 1)
  t.equal(wtf('{{monthyear+1}}').text(), `${months[next.getMonth()]} ${next.getFullYear()}`, 'monthyear+1')
  t.equal(wtf('{{age|2000|1|1}}').text(), String(yearsSince(2000, 1, 1)), 'age with no end date uses today')
  t.equal(wtf('{{age in years|2000|6|1}}').text(), `${yearsSince(2000, 6, 1)} years`, 'age in years until today')
  t.match(wtf('{{birth year and age|1950}}').text(), /^1950 \(age \d+/, 'birth year and age includes an age')
  t.match(wtf('{{time ago|2000-01-01}}').text(), / ago$/, 'time ago in the past')
  t.match(wtf('{{time ago|2100-01-01}}').text(), / from now$/, 'time ago in the future')
  t.end()
})

// these don't match what wikipedia renders, yet
test('date templates - known differences from wikipedia', { todo: true }, (t) => {
  const arr = [
    // df=yes means day-first
    ['{{birth date|1993|2|24|df=yes}}', '24 February 1993'],
    ['{{birth date and age|1993|2|4|df=yes}}', '4 February 1993'],
    ['{{start date|1993|2|24|df=y}}', '24 February 1993'],
    // one day short of 30 years
    ['{{age|1990|1|2|2020|1|1}}', '29'],
    // 2000 was 2nd millennium (1001-2000)
    ['{{millennium|2000}}', '2nd millennium'],
    // {{dts}} displays a readable date
    ['{{dts|2018|6|5}}', 'June 5, 2018'],
    ['{{dts|2018|June|5}}', 'June 5, 2018'],
    ['{{dts|2018|6}}', 'June 2018'],
    ['{{date|2006-08-04}}', '4 August 2006'],
  ]
  arr.forEach(([str, want]) => {
    t.equal(wtf(str).text(), want, str)
  })
  // calendar-accurate differences
  t.match(
    wtf('{{age in years, months and days|2000|1|1|2001|2|2}}').text(),
    /^1 year, 1 month,? (and )?1 day$/,
    'age in years, months and days: 1y 1m 1d'
  )
  t.match(
    wtf('{{age in years and days|2000|1|1|2001|1|11}}').text(),
    /^1 year,? (and )?10 days$/,
    'age in years and days: 1y 10d'
  )
  // given age is shown
  t.match(wtf('{{death date and given age|1993|2|24|51}}').text(), /\(aged 51\)$/, 'death date and given age')
  t.end()
})

test('time ago - whole units', (t) => {
  t.match(wtf('{{time ago|2000-01-01}}').text(), /^\d+ years ago$/, 'time ago rounds to whole years')
  const past = new Date()
  past.setDate(past.getDate() - 10)
  t.equal(wtf(`{{time ago|${past.toISOString().slice(0, 10)}}}`).text(), '1 week ago', 'weeks, singular')
  past.setDate(past.getDate() - 60)
  t.equal(wtf(`{{time ago|${past.toISOString().slice(0, 10)}}}`).text(), '2 months ago', 'months, plural')
  t.end()
})
