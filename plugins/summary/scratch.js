import wtf from '../../src/index.js'
import plg from './src/index.js'
wtf.extend(plg)

wtf.fetch('Elvis Presley').then((doc) => {
  console.log(doc.summary())
})
