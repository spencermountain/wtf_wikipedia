const wtf = require('./src/index')
wtf.extend(require('./plugins/wikis/wikinews/plugin'))

let str = `{{Infobox animanga/Novel
  | 著者 = [[白米良]]
  | イラスト = [[たかやKi]]
  | f出版社 = [[オーバーラップ (企業)|オーバーラップ]]
  | 掲載誌 = [[小説家になろう]]
  | レーベル = [[オーバーラップ文庫]]
  | 開始号 = 2013年11月7日
  | 終了号 = 
  | 開始日 = 2015年6月24日
  | 終了日 = 
  | 巻数 = 既刊16巻（本編11巻+外伝4巻+短編集1巻）<br />（2020年7月現在）
  | インターネット = 1
  }}`
// let doc = wtf(str)
// console.log(doc.infoboxes(0).json())

// str = `{{image source|file=Wikinews article wizard workflow.svg|[[Commons:User:Pi zero|Pi zero]]}}`
str = `'''Tom Anselmi''' (born {{circa|1956}}) is a Canadian [[sport]]s [[Senior management|executive]]. asdf  `
let arr = wtf(str).sentences()
// console.log(wtf(str).text())
console.log(arr.map((s) => s.text()))
