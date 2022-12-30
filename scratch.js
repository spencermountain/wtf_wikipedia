import wtf from './src/index.js'
import plg from './plugins/html/src/index.js'
wtf.plugin(plg)

let str = `= some heading =
after
`

str = `{{Infobox pageant titleholder
  | name         = Dee-Ann Kentish-Rogers
  | birth_date   = {{birth date and age|1993|01|13|df=yes}}
  | birth_place  = [[The Valley, Anguilla|The Valley]], [[Anguilla]]
  | image        = Dee Anne Kentish-Rogers political promo pose.jpg
  | caption      = Kentish-Rogers in a 2020 political advertisement
  | manager      = 
  | measurements = 
  | module={{Infobox officeholder |embed=yes
  |name         = 
  |image        = 
  |office       = 
  |monarch      = 
  |governor     =
  |office1      = Member of the [[Anguilla House of Assembly|House of Assembly]] for [[Valley South (Anguilla House of Assembly Constituency)|Valley South]]
  |term_start1  = 30 June 2020
  |predecessor1  = [[Victor Banks]]
  |successor1    =
  |term_end1    = 
  |party        = [[Anguilla Progressive Movement]]
  }}
  }}
`
let doc = wtf(str)
console.log(doc.infoboxes())
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