const keyVal = /[a-z0-9]+ *?= *?[a-z0-9]/i;
const strip = require('./_strip');

//generic unamed lists
// {{name|one|two|three}}
const pipeList = function(tmpl) {
  tmpl = strip(tmpl);
  let arr = tmpl.split(/\|/g);
  let obj = {
    template: arr[0].trim().toLowerCase(),
  };
  arr = arr.slice(1);

  arr.forEach((k, i) => {
    if (arr[i]) {
      //support gross 'id=234' format inside the value
      if (keyVal.test(arr[i]) === true) {
        arr[i] = arr[i].split('=')[1];
      }
      arr[i] = arr[i].trim();
    }
  });
  obj.data = arr;
  return obj;
};
module.exports = pipeList;
