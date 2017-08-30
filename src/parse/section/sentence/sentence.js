const sentence_parser = require('./sentence_parser');
const parseLine = require('./line');

const parseSentences = function(line) {
  let arr = [];
  let sentences = sentence_parser(line);
  sentences.forEach(function(str) {
    arr.push(parseLine(str));
  });
  return arr;
};
module.exports = parseSentences;
