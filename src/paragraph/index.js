const Paragraph = require('./Paragraph');
const twoNewLines = /\r?\n\W*\r?\n/;
const hasChar = /\w/;

const parseParagraphs = function(section, wiki) {
  let pList = wiki.split(twoNewLines);
  //don't create empty paragraphs
  pList = pList.filter(p => p && hasChar.test(p) === true);

  pList = pList.map(str => {
    return new Paragraph(str, section);
  });
  section.paragraphs = pList;
  return pList;
};
module.exports = parseParagraphs;
