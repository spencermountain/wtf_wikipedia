const Paragraph = require('./Paragraph')
const find_recursive = require('../_lib/recursive_match')
const parseSentences = require('../04-sentence').addSentences

const twoNewLines = /\r?\n\r?\n/
const parse = {
  image: require('../image'),
  list: require('../list')
}

const parseParagraphs = function(section, doc) {
  let wiki = section.wiki
  let paragraphs = wiki.split(twoNewLines)
  //don't create empty paragraphs
  paragraphs = paragraphs.filter(p => p && p.trim().length > 0)
  paragraphs = paragraphs.map(str => {
    let data = {
      lists: [],
      sentences: [],
      images: []
    }
    //parse the lists
    str = parse.list(str, data)
    //parse+remove scary '[[ [[]] ]]' stuff
    let matches = find_recursive('[', ']', str)
    // parse images
    str = parse.image(matches, data, str)
    //parse the sentences
    parseSentences(str, data)
    return new Paragraph(data)
  })
  section.wiki = wiki
  section.paragraphs = paragraphs
}
module.exports = parseParagraphs
