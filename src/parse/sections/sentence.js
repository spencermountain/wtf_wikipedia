const sentence_parser = require('../../lib/sentence_parser');
const parseLine = require('../text');

const parseSentences = function(line) {
  let arr = [];
  let sentences = sentence_parser(line);
  sentences.forEach(function(str) {
    arr.push(parseLine(str));
  });
  return arr;
};
module.exports = parseSentences;
