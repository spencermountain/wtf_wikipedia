import wtf from './src/index.js'
import plg from './plugins/html/src/index.js'
wtf.plugin(plg)

let str = `  {{MedalCount
  | [[Winter Olympic Games|Olympic Games]] | 8 | 4 | 1
  | [[Biathlon World Championships|World Championships]] | 19 | 12 | 9
  | {{nowrap|[[Summer Biathlon World Championships|Summer World Championships]]}} | 1 | 1 | 1
  | {{nowrap|[[Norwegian Biathlon Championships|Norwegian Championships]]}} | 30 | 8 | 12
  | {{nowrap|Summer Norwegian Championships}} | 14 | 5 | 0
  | {{nowrap|[[Biathlon Junior World Championships|Junior World Championships]]}} | 3 | 0 | 1
  | {{nowrap|Junior Norwegian Championships}} | 4 | 1 | 1
  | '''Total (135 medals)''' | '''79''' | '''31''' | '''25'''
  }}`
let doc = wtf(str)
// console.log(doc.links().map(l => l.json()))
console.log(doc.templates()[0].json())
// console.log(doc.categories())
// console.log('after')

// wtf.fetch('Dee-Ann Kentish-Rogers').then((doc) => {
// })

// wtf
//   .fetch(['Royal Cinema', 'Aldous Huxley'], {
//     lang: 'en',
//     'Api-User-Agent': 'spencermountain@gmail.com',
//   })
//   .then((docList) => {
//     let links = docList.map((doc) => doc.links())
//     console.log(links)
//   })