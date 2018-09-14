const Paragraph = require("./Paragraph");

const parseParagraphs = function(section, wiki) {
  let paragraphs = wiki.split(/\r?\n/).filter(p => p);
  paragraphs = paragraphs.map(str => {
    return new Paragraph(str, section);
  });
  section.paragraphs = paragraphs;
  return paragraphs;
};
module.exports = parseParagraphs;
