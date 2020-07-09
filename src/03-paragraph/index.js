const Paragraph = require('./Paragraph')
const parseSentences = require('../04-sentence').byParagraph

const twoNewLines = /\r?\n\r?\n/
const parse = {
  image: require('../image'),
  list: require('../list'),
}

const parseParagraphs = function (section, doc) {
  let wiki = section.wiki
  let paragraphs = wiki.split(twoNewLines)
  //don't create empty paragraphs
  paragraphs = paragraphs.filter((p) => p && p.trim().length > 0)
  paragraphs = paragraphs.map((str) => {
    let paragraph = {
      wiki: str,
      lists: [],
      sentences: [],
      images: [],
    }
    //parse the lists
    parse.list(paragraph)
    // parse images
    parse.image(paragraph, doc)
    //parse the sentences
    parseSentences(paragraph)
    return new Paragraph(paragraph)
  })
  section.wiki = wiki
  section.paragraphs = paragraphs
}
module.exports = parseParagraphs
