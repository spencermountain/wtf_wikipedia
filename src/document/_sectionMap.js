
//helper for looping around all section of a document
const sectionMap = function(doc, fn, n) {
  let arr = [];
  doc.sections().forEach((sec) => {
    let list = sec[fn]();
    if (list) {
      list.forEach((t) => {
        arr.push(t);
      });
    }
  });
  if (typeof n === 'number') {
    return arr[n];
  }
  return arr;
};
module.exports = sectionMap;
