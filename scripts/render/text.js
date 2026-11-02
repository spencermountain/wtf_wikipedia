import * as cheerio from 'cheerio'

const toText = (html) => {
  const $ = cheerio.load(html)
  $('style, script, table, figure').remove()
  $('.mw-editsection, .mw-references-wrap, .reference, .shortdescription').remove()
  $('#References').remove()

  // Normalize source whitespace before adding structural line breaks.
  $('*')
    .contents()
    .each((_, node) => {
      if (node.type === 'text') {
        node.data = node.data.replace(/\s+/g, ' ')
      }
    })

  const lineBreaks =
    'div, p, br, li, ul, ol, h1, h2, h3, h4, h5, h6, section, article, header, footer, blockquote, pre, dl, dt, dd, hr'
  $(lineBreaks).prepend('\n').append('\n')

  return $('body')
    .text()
    .split('\n')
    .map((line) => line.replace(/[^\S\n]+/g, ' ').trim())
    .filter(Boolean)
    .join('\n')
}
export default toText
// const html = '<div>Paragraph 1</div><div>Paragraph 2</div>'
// console.log(toText(html))
