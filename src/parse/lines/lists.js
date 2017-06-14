const list_reg = /^[#\*:;\|]+/;
const bullet_reg = /^\*+[^:,\|]{4}/;
const number_reg = /^ ?\#[^:,\|]{4}/;

//add implicit numberings to # formatting
const handleLists = function(lines) {
  let number = 1;
  lines.forEach(function(line) {
    //add # numberings formatting
    if (line.match(number_reg)) {
      line = line.replace(/^ ?#*/, number + ') ');
      line = line + '\n';
      number += 1;
      return;
    } else {
      number = 1;
    }
    //support bullet-points formatting
    if (line.match(bullet_reg)) {
      line = line + '\n';
    }
    //support lists
    if (line.match(list_reg)) {
      line = line.replace(list_reg, '');
    }
  });
  return lines;
};

const parseLists = function(r, wiki) {
  return wiki;
};

module.exports = parseLists;
