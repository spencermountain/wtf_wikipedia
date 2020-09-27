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


test('stock exchange EuronextParis', function(t) {
  var str = `
  {{Infobox settlement
  | traded_as = {{EuronextParis|MC|FR0000121014|XPAR}}
  }}
`
  let obj = wtf(str)
      .infobox(0)
      .keyValue()
  t.equal(obj[`traded_as`], 'euronextparis: MC FR0000121014', 'found EuronextParis')
  t.end()
})

test('stock exchange BarbadosSE', function(t) {
  var str = `
  {{Infobox settlement
  | traded_as = {{BarbadosSE|WIB}}
  }}
`
  let obj = wtf(str)
    .infobox(0)
    .keyValue()
  t.equal(obj[`traded_as`], 'barbadosse: WIB', 'found BarbadosSE')
  t.end()
})

test('stock exchange Irish Stock Exchange', function(t) {
  var str = `
  {{Infobox settlement
  | traded_as = {{ise|TCO|isin=GB0008847096}}
  }}
`
  let obj = wtf(str)
    .infobox(0)
    .keyValue()
  t.equal(obj[`traded_as`], 'ise: TCO', 'found Irish Stock Exchange')
  t.end()
})

test('stock exchange Market for Alternative Investment', function(t) {
  var str = `
{{Infobox Company
| traded_as={{MAI|UBIS}}
}}
`
  let obj = wtf(str)
    .infobox(0)
    .keyValue()
  t.equal(obj[`traded_as`], 'mai: UBIS', 'found Market for Alternative Investment')
  t.end()
})

test('stock exchange Market for Malta Stock Exchange', function(t) {
  var str = `
{{Infobox Company
| traded_as={{Malta Stock Exchange|GO}}
}}
`
  let obj = wtf(str)
    .infobox(0)
    .keyValue()
  t.equal(obj[`traded_as`], 'malta stock exchange: GO', 'found Market for Malta Stock Exchange')
  t.end()
})

test('stock exchange Market for NewConnect', function(t) {
  var str = `
{{Infobox Company
| traded_as={{NewConnect|BLO|isin=PLBLOBR00014}}
}}
`
  let obj = wtf(str)
    .infobox(0)
    .keyValue()
  t.equal(obj[`traded_as`], 'newconnect: BLO', 'found Market for NewConnect')
  t.end()
})

test('stock exchange Market for Grey Market', function(t) {
  var str = `
{{Infobox Company
| traded_as={{OTC Grey|ZAAP}}
}}
`
  let obj = wtf(str)
    .infobox(0)
    .keyValue()
  t.equal(obj[`traded_as`], 'otc grey: ZAAP', 'found Market for Grey Market')
  t.end()
})

test('stock exchange Market for Expert Market', function(t) {
  var str = `
{{Infobox Company
| traded_as={{OTC Expert|GNPR}}
}}
`
  let obj = wtf(str)
    .infobox(0)
    .keyValue()
  t.equal(obj[`traded_as`], 'otc expert: GNPR', 'found Market for Expert Market')
  t.end()
})
