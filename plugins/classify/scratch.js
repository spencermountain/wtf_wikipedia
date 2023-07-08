import wtf from '../../src/index.js'
import classify from './src/index.js'

wtf.extend(classify)

wtf.fetch('Antique (band)').then((doc) => {
  console.dir(doc.classify(), { depth: 5 })
})
