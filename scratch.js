var wtf = require('./src/index')
wtf.extend(require('./plugins/wikitext/src'))
// wtf.extend(require('./plugins/i18n/src'))

// var str = `[[Image:Levellers declaration and standard.gif|thumb|Woodcut from a [[Diggers]] document by [[William Everard (Digger)|William Everard]]]]`
// console.log(wtf(str).json())

// wtf.fetch('Template:2019–20 coronavirus pandemic data/United States/California medical cases chart').then((doc) => {
//   console.log(doc.template('medical cases chart'))
// })

let str = `===Events===

* {{buy
  | name=Harrods | alt= | url=http://www.harrods.com/ | email=
  | address=87–135 Brompton Rd SW1X 7XL | lat= | long= | directions=tube: Knightsbridge
  | phone=+44 20 7730 1234 | tollfree= | fax=
  | hours=M-Sa 10:00-20:00 | price=
  | lastedit=2015-01-15
  | content=The most famous store in London, favoured by the British establishment and owned by Mohamed Al-Fayed. Fairly strict dress code so do not turn up looking like a backpacker and expect to gain entrance.
  }}`
let doc = wtf(str)
// console.log(doc.paragraphs().map((p) => p.text()))
console.log('-----')
// console.log(doc.lists().map((p) => p.json()))
console.log(doc.text())
