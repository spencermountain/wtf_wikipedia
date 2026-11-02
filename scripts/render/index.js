import fetchHtml from './fetch.js'
import toText from './text.js'
import splitScreen from 'splitscreen-diff'
import wtf from '../../src/index.ts'

const renderText = async (page, lang) => {
  const html = await fetchHtml(page, lang)
  const text = await toText(html)
  return text
}

const res = await renderText('John Street Pumping Station', 'en')
console.log(res)
