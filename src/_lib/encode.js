// dumpster-dive throws everything into mongodb  - github.com/spencermountain/dumpster-dive
// mongo has some opinions about what characters are allowed as keys and ids.
//https://stackoverflow.com/questions/12397118/mongodb-dot-in-key-name/30254815#30254815
const specialChar = /[\\\.$]/;

const encodeStr = function(str) {
  if (typeof str !== 'string') {
    str = '';
  }
  str = str.replace(/\\/g, '\\\\');
  str = str.replace(/^\$/, '\\u0024');
  str = str.replace(/\./g, '\\u002e');
  return str;
};

const encodeObj = function( obj = {} ) {
  let keys = Object.keys(obj);
  for(let i = 0; i < keys.length; i += 1) {
    if (specialChar.test(keys[i]) === true) {
      let str = encodeStr(keys[i]);
      if (str !== keys[i]) {
        obj[str] = obj[keys[i]];
        delete obj[keys[i]];
      }
    }
  }
  return obj;
};

module.exports = {
  encodeObj: encodeObj
};
