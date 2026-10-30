import test from 'tape'
import { mock } from 'node:test'
import wtf from '../../lib/index.js'

test('inline-with-data', (t) => {
  mock.timers.enable({ apis: ['Date'], now: new Date('2024-07-15T12:00:00Z') })
  t.teardown(() => mock.timers.reset())
  const arr = [
    ['cad', '{{CAD|123.45|link=yes}}', 'C$123.45', { amount: '123.45' }],
    ['gbp', '{{GBP|123.45}}', '£123.45', { amount: '123.45' }],
    ['yel', '{{yel|67}}', "yellow: 67'", { min: '67' }],
    [
      'death date and age',
      '{{death date and age |1993|2|24 |1921|4|12 |df=yes}}',
      '24 February 1993',
      { year: '1993', month: '2', day: '24' },
    ],
    ['sentoff', '{{sent off|cards|min1|min2}}', "sent off: min1', min2'", { cards: 'cards' }],
    [
      'goal',
      '{{goal|14||54|p|72||87}}',
      "⚽ 14', 54' (p), 72', 87'",
      {
        data: [
          { min: '14', note: '' },
          { min: '54', note: 'p' },
          { min: '72', note: '' },
          { min: '87', note: '' },
        ],
      },
    ],
    ['isbn', '{{ISBN|978-1-4133-0454-1}}', 'ISBN 978-1-4133-0454-1', { id: '978-1-4133-0454-1' }],
    [
      'based on',
      '{{based on|"[[Super-Toys Last All Summer Long]]"|[[Brian Aldiss]]}}',
      '"Super-Toys Last All Summer Long" by Brian Aldiss',
      { title: '"Super-Toys Last All Summer Long"', author: 'Brian Aldiss' },
    ],
    ['mpc', '{{MPC|75482|(75482) 1999 XC173}}', '(75482) 1999 XC173', { number: '75482', text: '(75482) 1999 XC173' }],
    ['chem2', '{{chem2|CH3(CH2)5CH3}}', 'CH3(CH2)5CH3', { equation: 'CH3(CH2)5CH3' }],
    [
      'bbl to t',
      '{{bbl to t| 1 | 2 | 3 | 4 |API=|abbr=|lk=|adj=|per=|t_per=|mlt=}}',
      '1 barrels',
      { barrels: '1', list: ['2', '3', '4'] },
    ],
    [
      'death date',
      '{{Death date | 1993 | 2 | 24 | df=yes }}',
      '24 February 1993',
      { year: '1993', month: '2', date: '24', df: 'yes', text: '24 February 1993' },
    ],
    [
      'birth based on age as of date',
      '{{birth based on age as of date|50 |2017|12|18|mos=1}}',
      '1967 (age 50)',
      { age: '50', year: '2017', month: '12', day: '18' },
    ],
    ['birth-date and age', '{{Birth-date and age|December 1941}}', 'December 1941', { year: 1941, month: 12, date: 1 }],
    [
      'birth date and age2',
      '{{birth date and age2 |1988|6|10 |1961|7|4 |df=y}}',
      '4 July 1961',
      { birth_year: '1961', birth_month: '7', birth_day: '4' },
    ],
    [
      'start-date',
      '{{start-date|December 8, 1941 12:50PM Australia/Adelaide|tz=y}}',
      'December 8, 1941 12:50PM Australia/Adelaide',
      { year: 1941, month: 12, date: 8 },
    ],
    [
      'birth date',
      '{{Birth date|year=1993|month=2|day=24}}',
      'February 24, 1993',
      { year: '1993', month: '2', day: '24', text: 'February 24, 1993' },
    ],
    ['birthdeathage', '{{BirthDeathAge| |1976| | |1990| |}}', '1990', { year: 1990 }],
    [
      'death year and age',
      '{{Death year and age|2017|1967|12}} ',
      'December 2017',
      { death_year: '2017', birth_year: '1967', death_month: '12' },
    ],
    [
      'death date and age',
      '{{death date and age |1993|2|24 |1921|4|12 |mf=yes}}',
      'February 24, 1993',
      { year: '1993', month: '2', day: '24' },
    ],
    [
      'death-date and age',
      '{{Death-date and age| 30 May 1672 | 15 May 1623 | gregorian=9 June 1672 }}',
      '30 May 1672',
      { year: 1672, month: 5, date: 30 },
    ],
    [
      'death date and given age',
      '{{Death date and given age |1992|03|29 |30}}',
      'March 29, 1992 (aged 30)',
      { year: '1992', month: '03', day: '29' },
    ],
    ['death year and age', '{{Death year and age|2017|1967}} ', '2017', { death_year: '2017', birth_year: '1967' }],
    [
      'birth year and age',
      '{{Birth year and age|1963|12}} ',
      'December 1963 (age 61)',
      { birth_year: '1963', birth_month: '12' },
    ],
    ['mlbplayer', '{{mlbplayer|93|Spencer Kelly}}', 'Spencer Kelly', { number: '93', name: 'Spencer Kelly' }],
    ['samp', '{{samp|1=[A]bort, [R]etry, [F]ail?}}', '[A]bort, [R]etry, [F]ail?', { 1: '[A]bort, [R]etry, [F]ail?' }],
    [
      'infront 10000 écu behind',
      'infront {{Monnaie|10000|écu}} behind',
      'infront 10000 écu behind',
      { amount: '10000', code: 'écu' },
    ],
  ]
  arr.forEach(([name, input, text, fields]) => {
    const doc = wtf(input)
    t.equal(doc.templates().length, 1, name + ': template count')
    t.equal(doc.text(), text, name + ': text')
    const json = doc.templates()[0].json().data
    Object.entries(fields).forEach(([key, value]) => {
      t.deepEqual(json[key], value, name + ': ' + key)
    })
  })
  t.end()
})
