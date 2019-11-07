const wtf = require('../src/index')

wtf
  .fetch('https://en.wikipedia.org/wiki/List_of_time_zone_abbreviations')
  .then(doc => {
    let rows = doc.tables(0).keyValue()
    rows = rows.map(o => {
      return [o['Abbr.'], o['UTC offset']]
    })
    console.log(rows)
  })
  .catch(console.log)
