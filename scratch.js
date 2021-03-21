const wtf = require('./src/index')
const test = require('tape')

// wtf.extend(require('./plugins/wikis/wikinews'))
wtf.extend(require('./plugins/api/src'))

const opts = {
  'Api-User-Agent': 'wtf_wikipedia test script - <spencermountain@gmail.com>'
}


test('fetchList', (t) => {
  t.plan(3)
  let arr = ['Marina Gilardoni', 'Jessica Kilian', 'Tanja Morel']
  wtf.fetchList(arr, opts).then(function (docs) {
    docs.forEach((doc) => {
      t.ok(doc.sentence().text(), `got ${doc.title()}`)
    })
  })
})
