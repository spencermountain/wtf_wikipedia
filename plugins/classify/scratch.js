const wtf = require('../../src').default
const classify = require('./src').default
wtf.extend(classify)

wtf.fetch('Toronto').then((doc) => {
  console.log(doc.classify().details)
})
