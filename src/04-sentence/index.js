const helpers = require('../_lib/helpers');
const parseLinks = require('./links');
const parseFmt = require('./formatting');
const Sentence = require('./Sentence');
// const templates = require('./templates');
const sentenceParser = require('./sentence-parser');
const i18n = require('../_data/i18n');
const cat_reg = new RegExp(
  '\\[\\[:?(' + i18n.categories.join('|') + '):[^\\]\\]]{2,80}\\]\\]',
  'gi'
);

//return only rendered text of wiki links
const resolve_links = function(line) {
  // categories, images, files
  line = line.replace(cat_reg, '');
  // [[Common links]]
  line = line.replace(/\[\[:?([^|]{1,80}?)\]\](\w{0,5})/g, '$1$2');
  // [[File:with|Size]]
  line = line.replace(/\[\[File:(.{2,80}?)\|([^\]]+?)\]\](\w{0,5})/g, '');
  // [[Replaced|Links]]
  line = line.replace(/\[\[:?(.{2,80}?)\|([^\]]+?)\]\](\w{0,5})/g, '$2$3');
  // External links
  line = line.replace(
    /\[(https?|news|ftp|mailto|gopher|irc):\/\/[^\]\| ]{4,1500}([\| ].*?)?\]/g,
    '$2'
  );
  return line;
};
// console.log(resolve_links("[http://www.whistler.ca www.whistler.ca]"))

function postprocess(line) {
  //fix links
  line = resolve_links(line);
  //remove empty parentheses (sometimes caused by removing templates)
  line = line.replace(/\([,;: ]*\)/g, '');
  //these semi-colons in parentheses are particularly troublesome
  line = line.replace(/\( *(; ?)+/g, '(');
  //dangling punctuation
  line = helpers.trim_whitespace(line);
  line = line.replace(/ +\.$/, '.');
  return line;
}

function oneSentence(str) {
  let obj = {
    text: postprocess(str)
  };
  //pull-out the [[links]]
  let links = parseLinks(str);
  if (links) {
    obj.links = links;
  }
  //pull-out the bolds and ''italics''
  obj = parseFmt(obj);
  //pull-out things like {{start date|...}}
  // obj = templates(obj);
  return new Sentence(obj);
}

//turn a text into an array of sentence objects
const parseSentences = function(wiki) {
  let sentences = sentenceParser(wiki);
  sentences = sentences.map(oneSentence);

  //remove :indented first line, as it is often a disambiguation
  if (sentences[0] && sentences[0].text() && sentences[0].text()[0] === ':') {
    sentences = sentences.slice(1);
  }
  return sentences;
};

//used for consistency with other class-definitions
const addSentences = function(wiki, data) {
  data.sentences = parseSentences(wiki);
  return wiki;
};

module.exports = {
  parseSentences: parseSentences,
  oneSentence: oneSentence,
  addSentences: addSentences
};
