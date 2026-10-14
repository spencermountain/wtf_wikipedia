import test from 'tape'
import wtf from '../../lib/index.js'

// the parsed json data of date templates (their .text() output is covered in dates.test.js)
test('date template json', (t) => {
  const arr = [
    [
      '{{birth date|1941|4|12}}',
      {
        template: 'date',
        data: { year: '1941', month: '4', date: '12', template: 'birth date', text: 'April 12, 1941' },
      },
    ],
    ['{{birth date and age|1941|4|12}}', { year: '1941', month: '4', day: '12', template: 'birth date and age' }],
    [
      '{{death date and age|1993|2|24|1941|4|12}}',
      { year: '1993', month: '2', day: '24', list: ['1941', '4', '12'], template: 'death date and age' },
    ],
  ]
  arr.forEach(([tmpl, expected]) => {
    t.deepEqual(wtf(tmpl).templates()[0].json(), expected, tmpl)
  })
  t.end()
})

test('start date json keeps parsed data', (t) => {
  const json = wtf('{{start date|1976|4|1}}').templates()[0].json()
  t.equal(json.template, 'date')
  t.deepEqual(json.data, {
    year: '1976',
    month: '4',
    date: '1',
    template: 'start date',
    text: 'April 1, 1976',
  })
  t.end()
})
