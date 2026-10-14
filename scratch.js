import wtf from './src/index.ts'
import plg from './plugins/i18n/src/index.js'
import { readPage } from './tests/_examples/index.js'
wtf.plugin(plg)

const str = readPage('Charlie-Milstead')
const doc = wtf(str)
console.log(doc.template('1960 Houston Oilers').json())
