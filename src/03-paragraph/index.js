const Paragraph = require('./Paragraph');
const parseSentences = require('../04-sentence').parseSentences;

const twoNewLines = /\r?\n\W*\r?\n/;
const hasChar = /\w/;
const parse = {
  references: require('../reference'),
  list: require('../list'),
  templates: require('../templates'),
};

const parseParagraphs = function(wiki) {
  let pList = wiki.split(twoNewLines);
  //don't create empty paragraphs
  pList = pList.filter(p => p && hasChar.test(p) === true);

  pList = pList.map(str => {
    let data = {
      references: [],
      lists: [],
      sentences: [],
      templates: []
    };
    //parse-out the <ref></ref> tags
    str = parse.references(str, data);
    // str = refs.wiki;
    //parse-out all {{templates}}
    str = parse.templates(str, data);
    // //parse the lists
    str = parse.list(str, data);
    //parse the sentences
    parseSentences(str, data);
    return new Paragraph(data);
  });
  return {
    paragraphs: pList,
    wiki: wiki
  };
};
module.exports = parseParagraphs;
