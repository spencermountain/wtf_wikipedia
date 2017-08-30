const list_reg = /^[#\*:;\|]+/;
const bullet_reg = /^\*+[^:,\|]{4}/;
const number_reg = /^ ?\#[^:,\|]{4}/;
const parseLine = require('../text');

const isList = function(line) {
  return list_reg.test(line) || bullet_reg.test(line) || number_reg.test(line);
};

const cleanList = function(list) {
  let number = 1;
  for (var i = 0; i < list.length; i++) {
    var line = list[i];
    //add # numberings formatting
    if (line.match(number_reg)) {
      line = line.replace(/^ ?#*/, number + ') ');
      line = line + '\n';
      number += 1;
    } else if (line.match(list_reg)) {
      number = 1;
      line = line.replace(list_reg, '');
    }
    list[i] = parseLine(line);
  }
  return list;
};

module.exports = {
  isList: isList,
  cleanList: cleanList
};
