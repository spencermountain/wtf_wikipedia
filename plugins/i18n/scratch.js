import wtf from '../../src/index.js'
import i18n from './src/index.js'
wtf.extend(i18n)

wtf.fetch('https://ja.wikipedia.org/wiki/ベルリン').then((doc) => {
  console.log(doc.coordinates())
})
