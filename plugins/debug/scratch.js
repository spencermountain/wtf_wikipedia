import wtf from '../../src/index.js'
import plg from './src/index.js'
wtf.extend(plg)

wtf.fetch('Harry Potter').then((doc) => {
  let isBad = doc.isBad()
  if (!isBad) {
    console.log(doc.title(), '👍\n\n')
  } else {
    console.log(doc.title(), '❌\n\n')

    console.log(doc.sentences()[0].text())
  }
})
