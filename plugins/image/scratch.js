import wtf from '../../src/index.js'
import plg from './src/index.js'
wtf.extend(plg)

wtf.fetch('Hamburg').then((doc) => {
  console.log(doc.mainImage().thumb())
  // https://wikipedia.org/wiki/Special:Redirect/file/Flag_of_Hamburg.svg?width=300
})
