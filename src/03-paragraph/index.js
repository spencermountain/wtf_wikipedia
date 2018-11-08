const Paragraph = require('./Paragraph');
const find_recursive = require('../_lib/recursive_match');
const parseSentences = require('../04-sentence').addSentences;

const twoNewLines = /\r?\n\W*\r?\n/;
const hasChar = /\w/;
const parse = {
  image: require('../image'),
  list: require('../list'),
};

const parseParagraphs = function(wiki) {
  let pList = wiki.split(twoNewLines);
  //don't create empty paragraphs
  pList = pList.filter(p => p && hasChar.test(p) === true);

  pList = pList.map(str => {
    let data = {
      lists: [],
      sentences: [],
      images: []
    };
    //parse the lists
    str = parse.list(str, data);
    //parse+remove scary '[[ [[]] ]]' stuff
    let matches = find_recursive('[', ']', str);
    // parse images
    str = parse.image(matches, data, str);
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
