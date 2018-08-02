const keyVal = /[a-z0-9]+ *?= *?[a-z0-9]/i;
const pipes = require('./_pipes');

//generic unamed lists
// {{name|one|two|three}}
const pipeList = function(tmpl) {
  let found = pipes(tmpl);
  let obj = {
    template: found.name
  };
  let arr = found.list || [];
  arr.forEach((k, i) => {
    if (arr[i]) {
      //support this gross 'id=234' format inside the value
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
