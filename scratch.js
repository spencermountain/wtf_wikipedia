import wtf from './src/index.ts'
import plg from './plugins/i18n/src/index.js'
import { readPage } from './tests/_examples/index.js'
wtf.plugin(plg)

// const str = readPage('Charlie-Milstead')
const str = `
[[Thể loại:Khởi đầu năm 1834 ở Canada]]
[[Thể loại:Khu dân cư trên Tuyến hỏa xa ngầm]]
[[Thể loại:Toronto]]
[[Thể loại:Thành phố ở Ontario]]
[[Thể loại:Khu dân cư thành lập năm 1793]]
  `
const doc = wtf(str)
console.log(doc.categories())
