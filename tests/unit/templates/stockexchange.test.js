import test from 'tape'
import wtf from '../../lib/index.js'

test('stock exchange only', function (t) {
  const str = `
  {{Infobox settlement
  | traded_as = {{BSE}}
  }}
`
  const obj = wtf(str).infoboxes()[0]
  t.equal(obj.get(`traded_as`).text, 'bse', 'found bse')
  t.end()
})

test('stock exchange with number', function (t) {
  const str = `
  {{Infobox settlement
  | traded_as = {{BSE|500800}}
  }}
`
  const obj = wtf(str).infoboxes()[0]
  t.equal(obj.get(`traded_as`).text, 'bse: 500800', 'found bse with number')
  t.end()
})

test('stock exchange tokyo', function (t) {
  const str = `
  {{Infobox settlement
  | traded_as = {{tyo|9477}}
  }}
`
  const obj = wtf(str).infoboxes()[0]
  t.equal(obj.get(`traded_as`).text, 'tyo: 9477', 'found tokyo')
  t.end()
})

test('stock exchange nyse', function (t) {
  const str = `
  {{Infobox settlement
  | traded_as = {{nyse|MUFG}}
  }}
`
  const obj = wtf(str).infoboxes()[0]
  t.equal(obj.get(`traded_as`).text, 'nyse: MUFG', 'found nyse')
  t.end()
})

test('stock exchange NASDAQ', function (t) {
  const str = `
  {{Infobox settlement
  | traded_as = {{NASDAQ|LYFT}}
  }}
`
  const obj = wtf(str).infoboxes()[0]
  t.equal(obj.get(`traded_as`).text, 'nasdaq: LYFT', 'found NASDAQ')
  t.end()
})

test('stock exchange SSE in list', function (t) {
  const str = `
  {{Infobox settlement
  | traded_as = {{ubl|{{SSE|122458}} (bond)|{{SSE|122470}} (bond)}}
  }}
`
  const obj = wtf(str).infoboxes()[0]
  t.equal(obj.get(`traded_as`).text, 'sse: 122458 (bond)\n\nsse: 122470 (bond)', 'found stock SSE exchange in list')
  t.end()
})

test('stock exchange EuronextParis', function (t) {
  const str = `
  {{Infobox settlement
  | traded_as = {{EuronextParis|MC|FR0000121014|XPAR}}
  }}
`
  const obj = wtf(str).infoboxes()[0]
  t.equal(obj.get(`traded_as`).text, 'euronextparis: MC FR0000121014', 'found EuronextParis')
  t.end()
})

test('stock exchange BarbadosSE', function (t) {
  const str = `
  {{Infobox settlement
  | traded_as = {{BarbadosSE|WIB}}
  }}
`
  const obj = wtf(str).infoboxes()[0]
  t.equal(obj.get(`traded_as`).text, 'barbadosse: WIB', 'found BarbadosSE')
  t.end()
})

test('stock exchange Irish Stock Exchange', function (t) {
  const str = `
  {{Infobox settlement
  | traded_as = {{ise|TCO|isin=GB0008847096}}
  }}
`
  const obj = wtf(str).infoboxes()[0]
  t.equal(obj.get(`traded_as`).text, 'ise: TCO', 'found Irish Stock Exchange')
  t.end()
})

test('stock exchange Market for Alternative Investment', function (t) {
  const str = `
{{Infobox Company
| traded_as={{MAI|UBIS}}
}}
`
  const obj = wtf(str).infoboxes()[0]
  t.equal(obj.get(`traded_as`).text, 'mai: UBIS', 'found Market for Alternative Investment')
  t.end()
})

test('stock exchange Market for Malta Stock Exchange', function (t) {
  const str = `
{{Infobox Company
| traded_as={{Malta Stock Exchange|GO}}
}}
`
  const obj = wtf(str).infoboxes()[0]
  t.equal(obj.get(`traded_as`).text, 'malta stock exchange: GO', 'found Market for Malta Stock Exchange')
  t.end()
})

test('stock exchange Market for NewConnect', function (t) {
  const str = `
{{Infobox Company
| traded_as={{NewConnect|BLO|isin=PLBLOBR00014}}
}}
`
  const obj = wtf(str).infoboxes()[0]
  t.equal(obj.get(`traded_as`).text, 'newconnect: BLO', 'found Market for NewConnect')
  t.end()
})

test('stock exchange Market for Grey Market', function (t) {
  const str = `
{{Infobox Company
| traded_as={{OTC Grey|ZAAP}}
}}
`
  const obj = wtf(str).infoboxes()[0]
  t.equal(obj.get(`traded_as`).text, 'otc grey: ZAAP', 'found Market for Grey Market')
  t.end()
})

test('stock exchange Market for Expert Market', function (t) {
  const str = `
{{Infobox Company
| traded_as={{OTC Expert|GNPR}}
}}
`
  const obj = wtf(str).infoboxes()[0]
  t.equal(obj.get(`traded_as`).text, 'otc expert: GNPR', 'found Market for Expert Market')
  t.end()
})
