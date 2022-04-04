import wtf from '../../src/index.js'
import plg from './src/index.js'
wtf.extend(plg)

wtf.fetch('Hamburg').then((doc) => {
  console.log(doc.sentences()[0].makeWikitext())
  // Hamburg is the [[List of cities in [[Germany]] by population|second-largest city]] in Germany after [[Berlin]]
})
