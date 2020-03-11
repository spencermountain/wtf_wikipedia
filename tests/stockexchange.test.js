var test = require('tape')
var wtf = require('./lib')

test('stock exchange only', function(t) {
  var str = `
  {{Infobox settlement
  | traded_as = {{BSE}}
  }}
`
  let obj = wtf(str)
    .infobox(0)
    .keyValue()
  t.equal(obj[`traded_as`], 'bse', 'found bse')
  t.end()
})

test('stock exchange with number', function(t) {
  var str = `
  {{Infobox settlement
  | traded_as = {{BSE|500800}}
  }}
`
  let obj = wtf(str)
    .infobox(0)
    .keyValue()
  t.equal(obj[`traded_as`], 'bse: 500800', 'found bse with number')
  t.end()
})

test('stock exchange tokyo', function(t) {
  var str = `
  {{Infobox settlement
  | traded_as = {{tyo|9477}}
  }}
`
  let obj = wtf(str)
    .infobox(0)
    .keyValue()
  t.equal(obj[`traded_as`], 'tyo: 9477', 'found tokyo')
  t.end()
})

test('stock exchange nyse', function(t) {
  var str = `
  {{Infobox settlement
  | traded_as = {{nyse|MUFG}}
  }}
`
  let obj = wtf(str)
    .infobox(0)
    .keyValue()
  t.equal(obj[`traded_as`], 'nyse: MUFG', 'found nyse')
  t.end()
})

test('stock exchange NASDAQ', function(t) {
  var str = `
  {{Infobox settlement
  | traded_as = {{NASDAQ|LYFT}}
  }}
`
  let obj = wtf(str)
    .infobox(0)
    .keyValue()
  t.equal(obj[`traded_as`], 'nasdaq: LYFT', 'found NASDAQ')
  t.end()
})

test('stock exchange SSE in list', function(t) {
  var str = `
  {{Infobox settlement
  | traded_as = {{ubl|{{SSE|122458}} (bond)|{{SSE|122470}} (bond)}}
  }}
`
  let obj = wtf(str)
    .infobox(0)
    .keyValue()
  t.equal(obj[`traded_as`], 'sse: 122458 (bond)\n\nsse: 122470 (bond)', 'found stock SSE exchange in list')
  t.end()
})
