import wtf from '../../src/index.js'
import plg from './src/index.js'
wtf.extend(plg)

wtf.fetch('Hamburg').then(async (doc) => {
  console.log(await doc.mainImage().license())
  // https://wikipedia.org/wiki/Special:Redirect/file/Flag_of_Hamburg.svg?width=300
})
