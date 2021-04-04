let obj = require('/Users/spencer/mountain/wtf_wikipedia/plugins/classify/src/byInfobox/mapping.js')

let res = {}
Object.keys(obj).forEach((k) => {
  res[obj[k]] = res[obj[k]] || []
  res[obj[k]].push(k)
})
console.log(JSON.stringify(res, null, 2))
