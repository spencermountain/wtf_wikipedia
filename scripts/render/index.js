import fetchHtml from './fetch-html.js'
import fetchWiki from './fetch-wiki.js'
import toText from './text.js'
import splitScreen from 'splitscreen-diff'
import wtf from '../../src/index.ts'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
const dir = path.dirname(fileURLToPath(import.meta.url))

const renderText = async (page, lang, debug = false) => {
  const html = await fetchHtml(page, lang)
  const text = toText(html)
  const doc = await wtf.fetch(page, lang)
  const text2 = doc.text()

  if (debug) {
    const wiki = await fetchWiki(page, lang)
    const loc = path.join(dir, './_output')
    fs.writeFileSync(loc + `/page-wiki.txt`, wiki)
    fs.writeFileSync(loc + `/page-html.html`, html)
    fs.writeFileSync(loc + `/page-render.txt`, text)
    fs.writeFileSync(loc + `/page-text.txt`, text2)
  }
  await splitScreen(text, text2)
  // return text2
}

const res = await renderText('Delta Toronto Hotel', 'en', true)
// console.log(res)
