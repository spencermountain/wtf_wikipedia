import test from 'tape'
import wtf from '../../lib/index.js'

// {{birth date and age}} appends today's age, which these cases don't pin
const noAge = (str) => str.replace(/ \(age \d+\)$/, '')

test('structured date templates', (t) => {
  const arr = [
    ['{{Birth date|1993|2|24}}', 'February 24, 1993'],
    ['{{Birth date|1993|2|4|df=yes}}', '4 February 1993'],
    ['{{Birth date|1919|12|4|df=yes}}', '4 December 1919'],
    ['{{Death date|1993|2|4}}', 'February 4, 1993'],
    ['{{Death date|1919|12|4|df=yes}}', '4 December 1919'],
    ['{{Death date|1642|1|30|mf=yes}}', 'January 30, 1642'],

    ['{{dob|1997|3|14|df=yes}}', '14 March 1997'],
    ['{{Bda|1992|3|4|df=yes}}', '4 March 1992'],

    ['{{Birth date and age|1993|2|4|df=yes}}', '4 February 1993'],
    ['{{Birth date and age|1992|1|14|df=yes}}', '14 January 1992'],
    ['{{Birth date and age|1993|january|14|df=yes}}', '14 January 1993'],
    ['{{Birth date and age|1902|december|01|df=yes}}', '1 December 1902'],
    ['{{Death date and given age|1993|2|4|df=yes}}', '4 February 1993'],
    ['{{Birth date and age|1941}}', '1941'],

    ['{{Death year and age|2017|1967}}', '2017'],

    //more!
    ['{{start date|1993}}', '1993'],
    ['{{start date|1993|02}}', 'February 1993'],
    ['{{start date|1993|02|24}}', 'February 24, 1993'],
    ['{{start date|1993|02|24|08|30}}', '08:30, February 24, 1993'],
    ['{{start date|1993|02|24|08|||+01:00}}', 'February 24, 1993 (+01:00)'],
    ['{{start date|1993|02|24|08|||-07:00}}', 'February 24, 1993 (-07:00)'],
    ['{{start date|1993|02|24|08|30|23}}', '08:30:23, February 24, 1993'],
    ['{{start date|1993|02|24|08|30|23|Z}}', '08:30:23, February 24, 1993 (UTC)'],
    ['{{start date|1993|02|24|08|30|23|+01:00}}', '08:30:23, February 24, 1993 (+01:00)'],
    ['{{start date|1993|02|24|08|30|23|-07:00}}', '08:30:23, February 24, 1993 (-07:00)'],
    ['{{End date|1993|2|24}}', 'February 24, 1993'],
    ['{{start-date|7 December 1941}}', '7 December 1941'],
    ['{{birth-date|17 December 1901}}', '17 December 1901'],
    ['{{end-date|June 18 1886}}', 'June 18 1886'],
    ['{{Start date and age|1997|03|26}}', 'March 26, 1997'],
    ['{{Start date and age|1986|01|01|df=yes}}', '1 January 1986'],
    ['{{Start date and age|2019|03|08}}', 'March 8, 2019'],
    ['{{Start date and age|2010|02|29|df=yes}}', '29 February 2010'],
  ]
  arr.forEach((a) => {
    const str = noAge(wtf(a[0]).text())
    t.equal(str, a[1], a[0] + ' ' + str)
  })
  t.end()
})

test('hyphenated language-date templates', (t) => {
  const arr = [
    ['{{start-date|December 7, 1942}}', 'December 7, 1942'],
    ['{{birth-date|7 December 1941}}', '7 December 1941'],
    ['{{end-date|7 December 1941}}', '7 December 1941'],
    ['{{start-date|5:43PM HST, December 7th, 1941|tz=y}}', '5:43PM HST, December 7th, 1941'],
    ['{{start-date|December 8, 1941 12:50PM Australia/Adelaide|tz=y}}', 'December 8, 1941 12:50PM Australia/Adelaide'],
    ['{{Birth-date and age|April 12, 1941}}', 'April 12, 1941'],
    ['{{Birth-date and age|12 April 1941}}', '12 April 1941'],
    ['{{Birth-date and age|1941}}', '1941'],
    ['{{start-date|7 March 2011}}', '7 March 2011'],
    ['{{end-date|December 8 2000}}', 'December 8 2000'],
    ['{{start-date| December 8, 1941 12:30PM Asia/Manila }}', 'December 8, 1941 12:30PM Asia/Manila'],
    ['born on {{birth-date|17 June 1941}}', 'born on 17 June 1941'],
    [
      'around {{start-date|5:43PM HST, December 7th, 1941|tz=y}} this century',
      'around 5:43PM HST, December 7th, 1941 this century',
    ],
    ['{{BirthDeathAge|B|1976}}', '1976'],
    ['{{BirthDeathAge|B|1976|6|6|1990|8|8}}', 'June 6, 1976'],
    ['{{BirthDeathAge| |1976| | |1990| |}}', '1990'],
    ['{{BirthDeathAge| |1976| | |1990|8|8}}', 'August 8, 1990'],
    ['{{BirthDeathAge|{{^}}|1976|{{^}}|{{^}}|2007|1|1}}', 'January 1, 2007'],
  ]
  arr.forEach((a) => {
    const str = wtf(a[0]).text()
    t.equal(str, a[1], a[0])
  })
  t.end()
})

test('age templates', (t) => {
  const arr = [
    ['{{Age|1989|7|23|2003|7|14}}', '13'],
    ['{{Age|1989|7|23|2018|2|28}}', '28'],
    ['{{age in years and months |1989|7|23 |2003|7|14}}', '13 years, 11 months'],
    ['{{age in years and months |1989|7|23 |1989|8|23}}', '1 month'],
    ['{{age in years and months |1989|7|23 |1990|7|23}}', '1 year'],
    ['{{Age nts|1989|7|23|2003|7|14}}', '13'],
  ]
  arr.forEach((a) => {
    const str = wtf(a[0]).text()
    t.equal(str, a[1], a[0])
  })
  t.end()
})

test('as of template', (t) => {
  const arr = [
    ['{{As of|2025}}', 'As of 2025'],
    ['{{As of|2025|01}}', 'As of January 2025'],
    ['{{As of|2025|01|28}}', 'As of 28 January 2025'],
    ['{{As of|2025|01|28|df=US}}', 'As of January 28, 2025'],
    ['{{As of|2025|01|28|lc=y}}', 'as of 28 January 2025'],
    ['{{As of|2010|4|1|alt=as of the [[2010 United States census]]}}', 'as of the 2010 United States census'],
    ['{{As of|2025|01|url=https://en.wikipedia.org/}}', 'As of January 2025'],
    ['{{As of|2025|01|28|df=US|since=y}}', 'Since January 28, 2025'],
    ['{{As of|2025|01|28|lc=y|since=y}}', 'since 28 January 2025'],
  ]
  arr.forEach((a) => {
    const str = wtf(a[0]).text()
    t.equal(str, a[1], a[0])
  })
  t.end()
})

test('Date-Template-Text', (t) => {
  t.equal(wtf(`{{date|June 8 2018|mdy}}`).text(), 'June 8 2018', 'month-day-year date')
  t.equal(wtf(`{{dts|July 1, 1867}}`).text(), 'July 1, 1867', 'written date')
  t.equal(wtf(`{{dts|2024|Jun|12}}`).text(), 'Jun 12 2024', 'separate date arguments')
  t.equal(wtf(`{{dts|-200}}`).text(), '200 BC', 'negative year')
  t.equal(wtf(`{{dts|2020-10-15|format=dm}}`).text(), '2020-10-15', 'day-month format')
  t.equal(wtf(`{{dts|2000-03-02|abbr=on}}`).text(), '2000-03-02', 'abbreviated month')
  t.end()
})
