
//helper for looping around all sections of a document
const sectionMap = function(doc, fn, clue) {
  let arr = [];
  doc.sections().forEach((sec) => {
    let list = [];
    if (typeof clue === 'string') {
      list = sec[fn](clue);
    } else {
      list = sec[fn]();
    }
    list.forEach((t) => {
      arr.push(t);
    });
  });
  if (typeof clue === 'number') {
    return arr[clue];
  }
  return arr;
};
module.exports = sectionMap;
