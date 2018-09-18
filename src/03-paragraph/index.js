const Paragraph = require('./Paragraph');
const eachSentence = require('../04-sentence').eachSentence;

const twoNewLines = /\r?\n\W*\r?\n/;
const hasChar = /\w/;
const parse = {
  references: require('../reference'),
  list: require('../list'),
};

const parseParagraphs = function(wiki, options) {
  let pList = wiki.split(twoNewLines);
  //don't create empty paragraphs
  pList = pList.filter(p => p && hasChar.test(p) === true);

  pList = pList.map(str => {

    //parse-out the <ref></ref> tags
    let refs = parse.references(str, options);
    str = refs.wiki;

    // //parse the lists
    let lists = parse.list(str);
    str = lists.wiki;

    let sentences = eachSentence(str);

    //create the paragraph object, with its data
    let data = {
      references: refs.references || [],
      lists: lists.lists || [],
      sentences: sentences
    };
    return new Paragraph(data);
  });
  return {
    paragraphs: pList,
    wiki: wiki
  };
};
module.exports = parseParagraphs;
