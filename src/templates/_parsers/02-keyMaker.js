// every value in {{tmpl|a|b|c}} needs a name
// here we come up with names for them
const hasKey = /^[a-z0-9\u00C0-\u00FF\._\- ]+=/iu;

//turn 'key=val' into {key:key, val:val}
const parseKey = function(str) {
  let parts = str.split('=');
  let key = parts[0] || '';
  let val = parts.slice(1).join('=');
  return {
    key: key.trim(),
    val: val.trim()
  };
};

//turn [a, b=v, c] into {'1':a, b:v, '2':c}
const keyMaker = function(arr, order) {
  let o = 0;
  return arr.reduce((h, str) => {
    str = (str || '').trim();
    //support named keys - 'foo=bar'
    if (hasKey.test(str) === true) {
      let res = parseKey(str);
      if (res.key) {
        h[res.key] = res.val;
        return h;
      }
    }
    //try a key from given 'order' names
    if (order && order[o]) {
      let key = order[o]; //here goes!
      h[key] = str;
    } else {
      h.list = h.list || [];
      h.list.push(str);
    }
    o += 1;
    return h;
  }, {});
};

module.exports = keyMaker;
