const helpers = require('../_lib/helpers')
const parseLinks = require('../link')
const parseFmt = require('./formatting')
const Sentence = require('./Sentence')
// const templates = require('./templates');
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

function oneSentence(str) {
  let obj = {}
  //pull-out the [[links]]
  str = parseLinks(str, obj)
  obj.text = postprocess(str)

  // let links = parseLinks(str)
  // if (links) {
  // obj.links = links
  // }
  //pull-out the bolds and ''italics''
  obj = parseFmt(obj)
  //pull-out things like {{start date|...}}
  // obj = templates(obj);
  return new Sentence(obj)
}

//turn a text into an array of sentence objects
const parseSentences = function(wiki) {
  let sentences = sentenceParser(wiki)
  sentences = sentences.map(oneSentence)

  //remove :indented first line, as it is often a disambiguation
  if (sentences[0] && sentences[0].text() && sentences[0].text()[0] === ':') {
    sentences = sentences.slice(1)
  }
  return sentences
}

//used for consistency with other class-definitions
const addSentences = function(paragraph) {
  paragraph.sentences = parseSentences(paragraph.wiki)
}

module.exports = {
  oneSentence: oneSentence,
  addSentences: addSentences
}
