import postprocess from '../../_lib/postprocess.ts'
import parseLinks from '../link/index.ts'
import parseFmt from './formatting.ts'
import Sentence from './Sentence.ts'
import sentenceParser from './parse.ts'

function fromText(str) {
  let obj = {
    wiki: str,
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
  //array of texts
  let sentences = sentenceParser(paragraph.wiki)
  //sentence objects
  sentences = sentences.map(fromText)
  //remove :indented first line, as it is often a disambiguation
  if (sentences[0] && sentences[0].text() && sentences[0].text()[0] === ':') {
    sentences = sentences.slice(1)
  }
  paragraph.sentences = sentences
}

export { fromText, byParagraph }
