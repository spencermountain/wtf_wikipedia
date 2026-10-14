import test from 'tape'
import wtf from '../lib/index.js'
import { mock } from 'node:test'

// Recovered from templates/dates.test.js; relative expectations use the frozen date below.
test('date template limitations', (t) => {
  mock.timers.enable({ apis: ['Date'], now: new Date('2018-02-16T12:00:00Z') })
  t.teardown(() => mock.timers.reset())
  const cases = [
    ['{{Birth-date and age|1941-04-12|Twelfth of April, 1941}}', 'Twelfth of April, 1941'],
    ['{{Death-date and given age|2018|2|5|df=yes}}', 'February 5, 2018'],
    ['{{birth date and age2 |1988|6|10 |1961|7|4 |df=y}}', '4 July 1961'],
    ['{{birth based on age as of date | 50 | 2017 | 02 | 16}}', '1966/1967'],
    ['{{Age in years, months and days|year=2001|month=1|day=15}}', '17 years, 1 month and 1 day'],
    ['{{Age in years, months and days|2001|01|15|2008|09|05}}', '7 years, 7 months and 21 days'],
    ['{{Age in years, months and days|2016|8|4|2016|9|5}}', '1 month and 1 day'],
    ['{{age in years and months |1989|7|23 |1989|8|22}}', '0 months'],
    ['{{age in years and months |1990|7|23 |1989|7|23}}', '−1 year'],
    ['{{age in years and months |1990|9|23 |1989|7|23}}', '−1 year, 2 months'],
    ['{{age in years and days|15 May 2010}}', '7 years, 277 days'],
    ['{{age in years and days|12 Aug 2003|24 Sep 2011}}', '8 years, 43 days'],
    ['{{age in years and days|1989|7|23}}', '28 years, 208 days'],
    ['{{age in years and days|1989|7|23|2003|7|24}}', '14 years, 1 day'],
    ['{{age in years and days|2007|03|02|2008|03|02}}', '1 year, 0 days'],
    ['{{age in days|19 Aug 2008|4 Sep 2010}}', '746'],
    ['{{age in days|27 May 2002}}', '5,744'],
    ['{{Age as of date|50|2016|1|1}}', '52–53'],
    ['{{Age as of date|50|2016|12|31}}', '51–52'],
    ['{{Age as of date|50|2016|02|16}}', '52'],
    ['{{Age as of date|50|2016|Feb|16}}', '52'],
    ['{{Age as of date|50|2016|February|16}}', '52'],
  ]
  cases.forEach(([input, expected]) => {
    t.equal(wtf(input).text(), expected, input)
  })
  t.end()
})
