import { diffWords } from 'diff'
import wtf from '../../src/index.js'
import chalk from 'chalk'
import fromHtml from './html-version.js'
import plg from '../../plugins/api/src/index.js'
wtf.plugin(plg)



const fromWtf = async function (title) {
  let doc = await wtf.fetch(title)
  return doc.text()
}


const normalize = function (txt) {
  txt = txt.replace(/\s+/g, ' ')
  txt = txt.replace(/\*/g, '')
  return txt
}

const print = function (diff) {
  return diff.map(stringDiff => {
    if (!stringDiff.value.trim()) {
      return ''
    }
    if (stringDiff.added) return chalk.bgGreen(stringDiff.value) + '\n\n'
    else if (stringDiff.removed) return chalk.bgRed(stringDiff.value) + '\n\n'
    else return ''//stringDiff.value
  }).join('')
}


const compare = async function (title) {
  let mine = await fromWtf(title)
  let html = await fromHtml(title)

  mine = normalize(mine)
  html = normalize(html)

  const diff = diffWords(mine, html, { ignoreCase: true, ignoreWhitespace: true })
  console.log(print(diff))

}

const getRandom = async function () {
  let doc = await wtf.random()
  let title = doc.title()
  console.log('\n-----\n', title, '\n')
  console.log(`https://en.wikipedia.org/w/index.php?title=${title.replace(/ /g, '%20')}&action=edit`)
  let mine = doc.text()
  let html = await fromHtml(title)

  mine = normalize(mine)
  html = normalize(html)

  const diff = diffWords(mine, html, { ignoreCase: true, ignoreWhitespace: true })
  console.log(print(diff))
}

// let title = 'Toronto Raptors'
// compare(title)
getRandom()