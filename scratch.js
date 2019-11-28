const wtf = require('./src/index')
// const wtf = require('./builds/wtf_wikipedia.min')
// const readFile = require('./tests/lib/_cachedPage');
// const wtf = require('./builds/wtf_wikipedia');
// const wtf = require('./build');

wtf.extend(models => {
  // add a method to the Doc class
  models.Doc.prototype.sayHi = function() {
    console.log('hello ' + this.title())
  }
})

// wtf.fetch('Miami', 'en', function(err, doc) {
//   doc.sayHi()
// })

let doc = wtf(`
doesn't have {{geo|35.664036|139.698211}} 

{{usabledistrict}}
{{IsPartOf|Tokyo}}`)

console.log(doc.templates())
