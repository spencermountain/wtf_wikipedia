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

wtf.fetch('Miami', 'en', function(err, doc) {
  doc.sayHi()
})
