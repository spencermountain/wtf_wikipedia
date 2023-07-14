import wtf from '../../src/index.js'
import classify from './src/index.js'

wtf.extend(classify)

wtf.fetch('Diabetes').then((doc) => {
  // console.log(doc.infoboxes().map(i => i.type()))
  console.dir(doc.classify(), { depth: 5 })
})
