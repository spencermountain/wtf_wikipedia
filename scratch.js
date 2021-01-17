const wtf = require('./src/index')
// wtf.extend(require('./plugins/wikis/wikinews'))
wtf.extend(require('./plugins/disambig/src'))

// * Love_in_Bloom
// * Love_Is_the_Law
// * Love_Affair
// * Loutit
// * Louis_II
// * Loughridge
// * Lothrop    -  https://en.m.wikipedia.org/wiki/Lothian_(disambiguation)#/editor/all

// wtf.fetch('Love_in_Bloom').then((doc) => {
//   console.log(doc.disambiguation())
// })

let str = `'''[[Lothian]]''' is a traditional region in Scotland.

'''Lothian''' may also refer to:

==Scotland==
*[[Lothian and Borders]]
**[[East Lothian]]
**[[West Lothian]]
**[[Midlothian]]
**[[Edinburgh]]
*[[Lothian (Scottish Parliament electoral region)]]
**and its predecessor, [[Lothians (Scottish Parliament electoral region)]]
*[[NHS Lothian]], national health service region

==People==
*[[Marquess of Lothian]]
** [[Philip Kerr, 11th Marquess of Lothian]] (1882 - 1940) British politician specializing in foreign affairs
*[[Albert Lothian]], Scottish architect
*[[Dan Lothian]], American reporter for CNN
*[[Elizabeth Inglis Lothian]] (1881 - 1973), Australian teacher of classics
*[[Noel Lothian]], Australian botanist

==Other uses==
*[[Lothian, Maryland]], a community in the United States
*[[Lothian Books]], Melbourne, Australia
==See also==
* [[cool street]]
`
let doc = wtf(str)
doc.title('Lothian (disambiguation)')
console.log(doc.disambiguation())
// console.log(doc.list().lines())
