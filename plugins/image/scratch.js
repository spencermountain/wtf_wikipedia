import wtf from '../../src/index.js'
import plg from './src/index.js'
wtf.extend(plg)

wtf.fetch('Radiohead').then(async (doc) => {
  console.log(await doc.mainImage().commonsURL())
  // https://wikipedia.org/wiki/Special:Redirect/file/Flag_of_Hamburg.svg?width=300
})
