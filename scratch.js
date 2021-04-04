const wtf = require('./src/index')
wtf.extend(require('./plugins/wikis/wiktionary/plugin'))

// one
// let str = `[[one]] and [[two]]`
// let doc = wtf(str)
// console.log(doc.links(0))
// two

// // console.log(doc.table().json())

// let doc = wtf.fetch('Milwaukee Bucks').then((doc) => {
// console.log(doc.sentence(133))
// console.log(doc.sentence(133).json())
// })

let str = `{{Infobox animanga/Novel
| 著者 = [[白米良]]
| イラスト = [[たかやKi]]
| 出版社 = [[オーバーラップ (企業)|オーバーラップ]]
| 掲載誌 = [[小説家になろう]]
| レーベル = [[オーバーラップ文庫]]
| 開始号 = 2013年11月7日
| 終了号 = 
| 開始日 = 2015年6月24日
| 終了日 = 
| 巻数 = 既刊16巻（本編11巻+外伝4巻+短編集1巻）<br />（2020年7月現在）
| インターネット = 1
}}`
str = `* one
* Two  
* three  
`
let doc = wtf(str)
// console.log(doc.links(0).map((t) => t.text()))
// console.log(doc.infobox().wikitext())
console.log(doc.list().wikitext())
