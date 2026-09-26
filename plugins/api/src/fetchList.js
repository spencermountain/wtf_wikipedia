import slow from 'slow'
const isObject = function (obj) {
  return obj && Object.prototype.toString.call(obj) === '[object Object]'
}

const chunkBy = function (arr, chunkSize = 5) {
  const groups = []
  for (let i = 0; i < arr.length; i += chunkSize) {
    groups.push(arr.slice(i, i + chunkSize))
  }
  return groups
}

const fetchList = function (pages, options, wtf) {
  // support a list of strings, or objects
  if (pages[0] && isObject(pages[0])) {
    pages = pages.map((o) => o.title)
  }
  // fetch in groups of 5
  const groups = chunkBy(pages)

  const doit = function (group) {
    return wtf.fetch(group, options) //returns a promise
  }
  //only allow three requests at a time
  return slow.three(groups, doit).then((res) => {
    // flatten into one list
    return res.flat()
  })
}
export default fetchList
