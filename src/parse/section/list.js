const list_reg = /^[#\*:;\|]+/;
const bullet_reg = /^\*+[^:,\|]{4}/;
const number_reg = /^ ?\#[^:,\|]{4}/;
const parseLine = require('./sentence/line');

// does it start with a bullet point or something?
const isList = function(line) {
  return list_reg.test(line) || bullet_reg.test(line) || number_reg.test(line);
};

//make bullets/numbers into human-readable *'s
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

const parseList = function(r, wiki) {
  let lines = wiki.split(/\n/g);
  let lists = [];
  let theRest = [];
  for (let i = 0; i < lines.length; i++) {
    if (isList(lines[i]) && lines[i + 1] && isList(lines[i + 1])) {
      //greedy-extend the list
      for (let o = i + 1; o < lines.length; o++) {
        if (isList(lines[o])) {
          continue;
        }
        let all = lines.slice(i, o);
        all = cleanList(all);
        lists.push(all);
        i = o;
      }
    } else {
      theRest.push(lines[i]);
    }
  }
  r.lists = lists;
  return theRest.join('\n');
};
module.exports = parseList;
