import { Readability } from '@mozilla/readability'
import { JSDOM } from 'jsdom'
import unfetch from 'isomorphic-unfetch'


const fromHtml = async function (title) {
  let url = `https://en.wikipedia.org/w/api.php?format=json&action=query&prop=extracts&titles=${title}&redirects=true`
  let res = await unfetch(url).then((r) => r.json())
  let o = res.query.pages
  let html = Object.values(o)[0].extract

  const doc = new JSDOM(html)
  doc.window.document.querySelectorAll('h2').forEach(e => e.style.display = 'none')
  doc.window.document.querySelectorAll('h3').forEach(e => e.style.display = 'none')
  doc.window.document.querySelectorAll('h4').forEach(e => e.style.display = 'none')
  doc.window.document.querySelectorAll('table').forEach(e => e.style.display = 'none')
  let reader = new Readability(doc.window.document)
  let article = reader.parse().textContent
  return article
}
export default fromHtml