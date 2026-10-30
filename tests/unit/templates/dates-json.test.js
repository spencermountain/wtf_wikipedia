import test from 'tape'
import wtf from '../../lib/index.js'

// {{birth date and age}} appends today's age, which these cases don't pin
const noAge = (str) => str.replace(/ \(aged? \d+\)$/, '')

// the parsed json data of date templates (their .text() output is covered in dates.test.js)
test('date template json', (t) => {
  const arr = [
    [
      '{{birth date|1941|4|12}}',
      {
        template: 'birth date',
        kind: 'date',
        text: 'April 12, 1941',
        data: { year: '1941', month: '4', date: '12', text: 'April 12, 1941' },
      },
    ],
    [
      '{{birth date and age|1941|4|12}}',
      {
        template: 'birth date and age',
        kind: 'birth date and age',
        text: 'April 12, 1941',
        data: { year: '1941', month: '4', day: '12' },
      },
    ],
    [
      '{{death date and age|1993|2|24|1941|4|12}}',
      {
        template: 'death date and age',
        kind: 'birth date and age',
        text: 'February 24, 1993',
        data: { year: '1993', month: '2', day: '24', birth_year: '1941', birth_month: '4', birth_day: '12' },
      },
    ],
  ]
  arr.forEach(([tmpl, expected]) => {
    const json = wtf(tmpl).templates()[0].json()
    json.text = noAge(json.text)
    t.deepEqual(json, expected, tmpl)
  })
  t.end()
})

test('start date json keeps parsed data', (t) => {
  const json = wtf('{{start date|1976|4|1}}').templates()[0].json()
  t.equal(json.template, 'start date', 'template name')
  t.equal(json.kind, 'date', 'recognized date parser')
  t.deepEqual(json.data, {
    year: '1976',
    month: '4',
    date: '1',
    text: 'April 1, 1976',
  },
    'parsed date fields')
  t.end()
})
