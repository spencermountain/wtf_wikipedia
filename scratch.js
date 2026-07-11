import wtf from './src/index.js'
import plg from './plugins/i18n/src/index.js'
wtf.plugin(plg)


let input = `cool beans
{{infobox
| name = cool beans
| description = cool beans are cool
}}
cool beans are cool

[[Category:Cool beans]]
`

console.log(wtf(input).json('md'))

// const tables = wtf(input).tables()[0]
// console.log(tables.json())
// console.log(doc.references().map(r => r.json()))
// console.log(doc.json().sections[0].lists)
// console.log(doc.lists())
// const doc = await wtf.fetch("Mikel Arteta");
// const tables = doc?.section('Managerial statistics').tables();

// console.log("Rows: ", rows);
