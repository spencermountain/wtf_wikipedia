var test = require('tape')
var wtf = require('./_lib')

// this seems too much network traffic to run each test
test('parseCategory', function(t) {
  wtf.parseCategory('Major League Baseball venues').then(res => {
    let arr = res.docs.map(doc => {
      return doc.sentence().text()
    })
    arr = arr.filter(str => str)
    t.ok(arr.length > 8, 'found many docs')
    t.end()
  })
})
