const wtf = require('../../src')
const classify = require('./src')
wtf.extend(classify)

wtf.fetch('Radiohead').then((doc) => {
  console.log(doc.classify().details)
})
