import wtf from './src/index.js'
import plg from './plugins/i18n/src/index.js'
wtf.plugin(plg)



// images in tables:
// let str = `
// {|
// |-
// | [[File:Sword-0.png]]
// | [[Primitive Sword]]
// | 4
// | 15
// |}
// `
// let doc = wtf(str)
// console.log(doc.images())

// links json clean
let str = `a block east of the [[Magnificent Mile]], that exhibits international [[contemporary art]].  `
let doc = wtf(str)
console.log(doc.links().map(l => l.json()))
// { type: 'internal', page: 'Magnificent Mile' },
// {
//   text: 'contemporary art',
//   type: 'internal',
//   page: 'contemporary art',
// },


// JSON labeled
// let input = `cool beans
// {{infobox
// | name = cool beans
// | description = cool beans are cool
// }}
// cool beans are cool

// [[Category:Cool beans]]
// `

// console.log(wtf(input).json('md'))

// const tables = wtf(input).tables()[0]
// console.log(tables.json())
// console.log(doc.references().map(r => r.json()))
// console.log(doc.json().sections[0].lists)
// console.log(doc.lists())
// const doc = await wtf.fetch("Mikel Arteta");
// const tables = doc?.section('Managerial statistics').tables();

// console.log("Rows: ", rows);
