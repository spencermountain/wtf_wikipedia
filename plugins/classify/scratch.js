import wtf from '../../src/API/index.js'
import classify from './src/index.js'

wtf.extend(classify)

wtf.fetch('Radek Dvořák').then((doc) => {
  // console.log(doc.infoboxes().map(i => i.type()))
  console.dir(doc.classify(), { depth: 5 })
})
