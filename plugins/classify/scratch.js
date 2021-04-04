const wtf = require('../../src')
const classify = require('./src')
wtf.extend(classify)

wtf.fetch('Toronto').then((doc) => {
  console.log(doc.classify().details)
})
