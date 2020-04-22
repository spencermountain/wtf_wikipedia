const helpers = require('../_lib/helpers')
const parseLinks = require('../link')
const parseFmt = require('./formatting')
const Sentence = require('./Sentence')
const sentenceParser = require('./parse')

function postprocess(line) {
  //remove empty parentheses (sometimes caused by removing templates)
  line = line.replace(/\([,;: ]*\)/g, '')
  //these semi-colons in parentheses are particularly troublesome
  line = line.replace(/\( *(; ?)+/g, '(')
  //dangling punctuation
  line = helpers.trim_whitespace(line)
  line = line.replace(/ +\.$/, '.')
  return line
}

// returns one sentence object
function fromText(str) {
  let obj = {
    text: str,
  }
  //pull-out the [[links]]
  parseLinks(obj)
  obj.text = postprocess(obj.text)
  //pull-out the bolds and ''italics''
  obj = parseFmt(obj)
  //pull-out things like {{start date|...}}
  return new Sentence(obj)
}

//used for consistency with other class-definitions
const byParagraph = function (paragraph) {
  // array of texts
  let sentences = sentenceParser(paragraph.wiki)
  // sentence objects
  sentences = sentences.map(fromText)
  //remove :indented first line, as it is often a disambiguation
  if (sentences[0] && sentences[0].text() && sentences[0].text()[0] === ':') {
    sentences = sentences.slice(1)
  }
  paragraph.sentences = sentences
}

module.exports = {
  fromText: fromText,
  byParagraph: byParagraph,
}
