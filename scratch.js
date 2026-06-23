import wtf from './src/index.js'
import plg from './plugins/i18n/src/index.js'
wtf.plugin(plg)


let input = `{| class="wikitable"
|-
! AAA
! BBB
! CCC
! DDD
|-
| {{unbulleted list|A1}}
| {{unbulleted list|B1|B2}}
| {{ubl|{{Lbb|C1}}|{{nowrap|{{Lbc|C2|C3}}}}}}
| {{unbulleted list|[[D1]],|[[D2]]}}
|}`
input = `
| {{unbulleted list|A1}}
| {{unbulleted list|B1|B2}}
| {{ubl|{{Lbb|C1}}|{{nowrap|{{Lbc|C2|C3}}}}}}
| {{unbulleted list|[[D1]],|[[D2]]}}

`

console.log(wtf(input).text())

// const tables = wtf(input).tables()[0]
// console.log(tables.json())
// console.log(doc.references().map(r => r.json()))
// console.log(doc.json().sections[0].lists)
// console.log(doc.lists())
// const doc = await wtf.fetch("Mikel Arteta");
// const tables = doc?.section('Managerial statistics').tables();

// console.log("Rows: ", rows);
