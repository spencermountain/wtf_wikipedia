import wtf from './src/index.js'

let str = `
'''Hamburg''' ({{IPA-de|ˈhambʊʁk|lang|GeoTrinity Hamburg.ogg}}, {{IPA-dedia|ˈhambʊɪ̯ç|locally also|GeoTrinity Hamburch.ogg}}; {{lang-nds|label=[[Hamburg German|Low Saxon]]|Hamborg}} {{IPA-nds|ˈhambɔːç||GT Hamborch.ogg}}), officially the '''Free and Hanseatic City of Hamburg'''
`

// str = `{{Refplease|date=November 2023|reason=Your explanation here}} in [[Jolgeh-ye Musaabad Rural District]],`

// let doc = wtf(str)
const doc = await wtf.fetch('United Kingdom')
console.log(doc.isStub())
// console.log(doc.text())
// console.log(doc.wikidata() + '|')

// console.log(doc.template().json())
// console.log(doc.text())
// console.log(doc.references().map((r) => r.json()))
// console.log(doc.templates().map((r) => r.json()))
