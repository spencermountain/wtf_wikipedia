const sentence_parser = require('./sentence_parser');
const parseLine = require('./line');

const parseSentences = function(r, wiki) {
  let sentences = sentence_parser(wiki);
  sentences = sentences.map(parseLine);
  r.sentences = sentences;
  return r;
};
module.exports = parseSentences;
