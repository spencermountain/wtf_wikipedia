const test = require('tape')
const wtf = require('./_lib')

test('short description template summary', t => {
  let str = `{{short description|Baseball stadium in St. Petersburg, FL, USA}}
{{Use mdy dates|date=June 2013}}
{{Infobox venue
| stadium_name        = Tropicana Field
| nickname            = ''"The Trop"''
}}
`
  let summary = wtf(str).summary()
  t.equal(summary, 'Baseball stadium in St. Petersburg, FL, USA', 'short description')
  t.end()
})
