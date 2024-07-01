import wtf from './src/index.js'
import plg from './plugins/i18n/src/index.js'
wtf.plugin(plg)
let str = ``

// str = `{{subst|Medicine}}`
// str = `{{Rounddown|3.14159|3}}`

// str = `{{SubSup|a|b|C}}`
// str = `For example, fact {{r|RefName|p=22}}`

// str = `before
// :indent
// after`

str = `{{Info/Caso criminal|título=Caso Bruce|nome=Caso Bruce|localdocrime=Avenida Eliezer Magalhes, em [[Mirassol]], em [[São Paulo]], no [[Brasil]]|data=[[30 de outubro]] e [[31 de outubro]] de [[2019]]|tipodecrime=[[Maus tratos]]|armas=facão e Barra de Ferro|vitimas=Bruce {um cachorro pit bull]|desaparecidos=Bruce {um cachorro pit bull]}}

O '''Caso Bruce''' refere-se à morte de um cão pit bull por um ex-policial.`

// console.log(wtf('This is an\n:before\nafter').text())

// str = `{{Φ}}`

// str = `{{Refplease|date=November 2023|reason=Your explanation here}} in [[Jolgeh-ye Musaabad Rural District]],`

let doc = wtf(str)
console.log(doc.text())

// console.log(doc.json().sections[0])
// const doc = await wtf.fetch('Caso Bruce', 'pt')
// console.log(doc.text())
// console.log(doc.pageImage().json())
// console.log(doc.wikidata() + '|')

// console.log(doc.template().json())
// console.log(doc.text())
// console.log(doc.references().map((r) => r.json()))
// console.log(doc.templates().map((r) => r.json()))
