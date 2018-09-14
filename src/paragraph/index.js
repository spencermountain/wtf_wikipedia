const Paragraph = require('./Paragraph');
const twoNewLines = /\r?\n\W*\r?\n/;

const parseParagraphs = function(section, wiki) {
  let paragraphs = wiki.split(twoNewLines).filter(p => p);
  paragraphs = paragraphs.map(str => {
    return new Paragraph(str, section);
  });
  section.paragraphs = paragraphs;
  return paragraphs;
};
module.exports = parseParagraphs;
