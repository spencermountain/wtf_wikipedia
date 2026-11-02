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

  // Keep paragraph boundaries distinct until the final newline conversion.
  $('.mw-heading').replaceWith('\u2029')
  $('p').prepend('\u2029').append('\u2029')

  $('li').prepend('* ')

  const lineBreaks =
    'div, br, li, ul, ol, h1, h2, h3, h4, h5, h6, section, article, header, footer, blockquote, pre, dl, dt, dd, hr'
  $(lineBreaks).prepend('\n').append('\n\n')

  let text = $('body')
    .text()
    .split('\u2029')
    .map((section) =>
      section
        .split('\n')
        .map((line) => line.replace(/[^\S\n]+/g, ' ').trim())
        .filter(Boolean)
        .join('\n')
    )
    .filter(Boolean)
    .join('\n\n')

  // text = text.replace(/\n\n+/g, '\n\n')
  return text
}
export default toText
// const html = '<div>Paragraph 1</div><div>Paragraph 2</div>'
// console.log(toText(html))
